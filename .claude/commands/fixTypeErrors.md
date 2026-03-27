---
description: Locates a file by its name, checks for TypeScript errors, and fixes them without altering other code.
---

I am providing a file name (without the full path). 

<instructions>
1. **Locate the file:** Use your file search capabilities (or run a terminal command like `find . -name "the-provided-file-name"`) to find the exact, full path of the file I specified.
2. **Analyze:** Once you have the full path, read the file and identify the exact TypeScript errors. You can run `npx tsc --noEmit` targeting that specific file path to verify the issues.
3. **Fix:** Apply fixes strictly for the TypeScript errors (e.g., adding missing interfaces, defining proper types, fixing strict null checks).
4. **CRITICAL CONSTRAINT:** Do absolutely nothing else to the file. 
   - Do NOT refactor the business logic.
   - Do NOT change the code formatting or style.
   - Do NOT modify any unrelated code.
5. **Report:** Briefly state what errors you found and fixed.
</instructions>