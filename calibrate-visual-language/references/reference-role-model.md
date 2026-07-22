# Reference role model

Assign every image one or more explicit roles:

| Role | Use |
|---|---|
| `style-source` | Desired visual character or medium |
| `structure-source` | Composition, layout, or information architecture |
| `content-source` | Subject matter only |
| `detail-source` | A bounded trait such as linework or annotation |
| `anti-reference` | A prohibited direction or known failure |
| `candidate-lock` | Promising image awaiting explicit approval |
| `approved-lock` | Explicitly approved image for named traits |

For each reference, record:

- stable ID and relative path;
- SHA-256 checksum when bytes are local;
- provenance and rights notes when known;
- roles and approval state;
- traits it applies to and traits it does not apply to;
- applicable artifact and surface classes;
- crop, scale, or context dependencies;
- known limitations;
- approval date and approver for approved locks.

An image may apply to line character without applying to layout, palette, typography, anatomy, content, or density. Never treat a mood board as an undifferentiated instruction.

## Reference priority

For a disputed trait, use this order:

1. Explicit current user correction or override
2. Approved lock that applies to the trait
3. Approved structured rule
4. Approved generation-contract instruction
5. Candidate reference
6. Agent inference

If items at the same level conflict, stop and expose the conflict. Do not blend by default.
