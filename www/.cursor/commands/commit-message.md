Generate commit messages based on currently staged changes and copy to clipboard without any AI attribution.

**Process:**
1. Check git status to verify staged changes exist
2. Analyze staged changes with `git diff --staged`
3. Generate appropriate commit message based on staged changes only
4. Copy commit message to clipboard for easy pasting
5. Display the generated message

**Usage:** 
- `/commit-message` - Generate commit message from staged changes
- `/commit-message --format simple` - Generate simple format message  
- `/commit-message --scope <scope>` - Add scope to conventional commit format

**Important:** 
- Only analyzes staged changes (files added with `git add`)
- Never stages files automatically (no `git add .`)
- Never include AI attribution, "Generated with Claude", "Created by", or similar text in commits
- Does not create actual commits, only generates and copies messages