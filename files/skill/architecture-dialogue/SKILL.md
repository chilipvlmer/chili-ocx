# Architecture Dialogue

> Framework for technology decisions and trade-off analysis

## TL;DR

Structured approach to making and documenting technology decisions through systematic evaluation of requirements, options, and trade-offs.

## When to Use

- Converting PRD to RFC (mandatory)
- Making technology/framework decisions
- Documenting architectural trade-offs
- Evaluating competing technical solutions
- Justifying technology choices to stakeholders

## Technology Decision Process

Follow this 5-step process for all technology decisions:

1. **Requirements Analysis**: Extract technical requirements from PRD
2. **Option Evaluation**: Identify technology options and frameworks
3. **Trade-off Analysis**: Compare options across key criteria
4. **Stakeholder Consideration**: Align with team skills and business constraints
5. **Decision Documentation**: Record decision rationale and alternatives

## Decision Criteria

Evaluate all options against these 7 criteria:

- **Functional Fit**: How well does option meet functional requirements?
- **Performance**: Does option meet performance and scalability needs?
- **Security**: Does option meet security and compliance requirements?
- **Maintainability**: How maintainable and supportable is the option?
- **Team Skills**: Does team have required skills or can they be acquired?
- **Cost**: What are the total cost implications including training and licensing?
- **Ecosystem**: What is the strength of ecosystem and community support?

## Trade-off Presentation Template

Use this template to document technology decisions:

```markdown
## Technology Decision: {Component Type}

### Requirements
- **Functional Requirements**: {derived_from_prd}
- **Performance Requirements**: {specific_targets}
- **Security Requirements**: {compliance_needs}
- **Integration Requirements**: {system_dependencies}

### Options Analysis

#### Option 1: {Technology/Framework}
**Pros**:
- {advantage_1}
- {advantage_2}
- {advantage_3}

**Cons**:
- {disadvantage_1}
- {disadvantage_2}
- {disadvantage_3}

**Fit Assessment**:
- Functional Fit: {score}/10
- Performance: {score}/10
- Security: {score}/10
- Maintainability: {score}/10
- Team Skills: {score}/10
- Cost: {score}/10
- **Overall Score**: {total_score}/60

#### Option 2: {Technology/Framework}
[Same analysis structure]

#### Option 3: {Technology/Framework}
[Same analysis structure]

### Recommendation
**Chosen Option**: {selected_technology}
**Primary Reason**: {key_decision_factor}
**Trade-offs Accepted**: {accepted_trade_offs}
**Mitigation Strategies**: {how_to_address_disadvantages}
**Implementation Considerations**: {specific_implementation_notes}
```

## What NOT to Do

- Don't skip the requirements analysis phase
- Don't evaluate fewer than 2 options
- Don't make decisions based on personal preference alone
- Don't ignore team skill constraints
- Don't fail to document trade-offs and alternatives
- Don't prescribe specific technologies without context

## Notes

This framework emphasizes **process over prescription**. The goal is to make well-reasoned decisions that can be explained and justified, not to mandate specific technologies.

Use the scoring system (X/10 per criterion) to create objective comparisons, but remember that scores are tools for discussion, not absolute truth.
