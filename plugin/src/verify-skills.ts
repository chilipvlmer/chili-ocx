
import { SkillRunner, InteractiveHaltError } from './skills/runner.js';
import { Skill } from './skills/loader.js';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

async function runTests() {
  console.log('🌶️  Starting Skill Verification Tests...\n');
  let passed = 0;
  let failed = 0;

  // --- Test 1: Permission Check ---
  console.log('Test 1: Permission Check (rm -rf /)');
  try {
    const dangerousSkill: Skill = {
      id: 'danger',
      name: 'Danger Skill',
      description: 'Tests security',
      steps: [{
        name: 'wipe_all',
        type: 'shell',
        command: 'rm -rf /'
      }]
    };

    const runner = new SkillRunner(dangerousSkill, {});
    await runner.execute();
    console.error('❌ FAIL: Dangerous command was executed!');
    failed++;
  } catch (error: any) {
    if (error.message.includes('Command blocked')) {
      console.log('✅ PASS: Dangerous command blocked.');
      passed++;
    } else {
      console.error(`❌ FAIL: Unexpected error: ${error.message}`);
      failed++;
    }
  }

  // --- Test 2: Regex Scan ---
  console.log('\nTest 2: Regex Scan (Secret Detection)');
  const secretFile = 'test-secret.env';
  try {
    // Create dummy secret file
    await writeFile(secretFile, 'AWS_KEY=AKIA1234567890\nSECRET=true');

    const scanSkill: Skill = {
      id: 'scan',
      name: 'Scan Skill',
      description: 'Tests regex scanning',
      steps: [{
        name: 'scan_secrets',
        type: 'regex_scan',
        file: secretFile,
        pattern: 'AWS_KEY',
        fail_if_match: true
      }]
    };

    const runner = new SkillRunner(scanSkill, {});
    await runner.execute();
    console.error('❌ FAIL: Secret was not detected!');
    failed++;
  } catch (error: any) {
    if (error.message.includes('Regex match found')) {
      console.log('✅ PASS: Secret detected and execution halted.');
      passed++;
    } else {
      console.error(`❌ FAIL: Unexpected error: ${error.message}`);
      failed++;
    }
  } finally {
    // Cleanup
    try { await unlink(secretFile); } catch {}
  }

  // --- Test 3: Interactive Flow ---
  console.log('\nTest 3: Interactive Flow');
  const interactiveSkill: Skill = {
    id: 'interactive',
    name: 'Interactive Skill',
    description: 'Tests interactive steps',
    steps: [
      {
        name: 'gen_msg',
        type: 'shell',
        command: 'echo "Generated Message"',
        // We'll mock the output via "mock_output" not usually available on shell, 
        // but let's rely on the runner storing stdout.
      },
      {
        name: 'ask_user',
        type: 'interactive',
        input_source: 'gen_msg'
      }
    ]
  };

  // 3a: Run without confirm (expect halt)
  console.log('  3a: Initial run (expect halt)');
  try {
    const runner = new SkillRunner(interactiveSkill, {});
    const result = await runner.execute();
    
    if (result.halted && result.proposal) {
        console.log(`✅ PASS: Halted with proposal: "${result.proposal}"`);
        passed++;
    } else {
        console.error('❌ FAIL: Interactive step did not halt (result.halted is false)!');
        failed++;
    }
  } catch (error: any) {
    console.error(`❌ FAIL: Unexpected error: ${error.message}`);
    failed++;
  }

  // 3b: Run with confirm (expect success)
  console.log('  3b: Confirmation run (expect success)');
  try {
    const runner = new SkillRunner(interactiveSkill, { confirm: true });
    const result = await runner.execute();
    if (result.steps.ask_user?.confirmed) {
      console.log('✅ PASS: Interactive step confirmed and finished.');
      passed++;
    } else {
      console.error('❌ FAIL: Step did not return confirmation status.');
      failed++;
    }
  } catch (error: any) {
    console.error(`❌ FAIL: Execution failed despite confirmation: ${error.message}`);
    failed++;
  }

  // Summary
  console.log('\n--- Summary ---');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  
  if (failed > 0) process.exit(1);
}

runTests().catch(e => {
  console.error('Test Runner Crashed:', e);
  process.exit(1);
});
