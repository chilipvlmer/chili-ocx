---
name: review
description: Review code for quality, security, and best practices
agent: habanero
---

# Code Review

The user wants a code review.

**Your task (Habanero):**

1. Ask what needs review using the `question` tool:
   - "Recent changes (git diff)"
   - "Specific file or directory"
   - "Entire codebase"
   - "Current task from plan"

2. Based on selection, read the relevant code

3. Review for:
   - **Correctness**: Logic errors, edge cases
   - **Security**: Vulnerabilities, input validation
   - **Performance**: Inefficiencies, bottlenecks
   - **Maintainability**: Code clarity, documentation
   - **Best Practices**: Language idioms, patterns
   - **Testing**: Coverage, test quality

4. Provide structured feedback:
   ```markdown
   ## Code Review: {scope}
   
   ### ✅ Strengths
   - Well-structured authentication flow
   - Good error handling
   
   ### ⚠️ Issues Found
   
   #### High Priority
   - **Security**: SQL injection risk in user query (line 45)
   - **Bug**: Race condition in concurrent access (line 89)
   
   #### Medium Priority
   - **Performance**: N+1 query in user list (line 120)
   - **Maintainability**: Complex nested conditionals (line 200)
   
   #### Low Priority  
   - **Style**: Inconsistent naming conventions
   - **Documentation**: Missing docstrings
   
   ### 💡 Recommendations
   1. Use parameterized queries for all database access
   2. Add mutex locks for shared state
   3. Implement eager loading for user relationships
   4. Extract complex conditions into named functions
   ```

5. Add findings to `.pepper/notepad/issues.json` if significant

6. Tell user to switch back to Scoville or continue with `/work`
