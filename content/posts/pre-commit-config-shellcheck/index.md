---
ceoTitle: pre-commit-config-shellcheck for syntax and semantic checks automation
title: pre-commit-config-shellcheck for syntax and semantic checks automation
breadcrumbs: pre-commit-config-shellcheck
slug: pre-commit-config-shellcheck
draft: false
publishDate: 2022-08-18T00:00:00Z
image: nemo.jpg
og_image: nemo.jpg
description: pre-commit-config-shellcheck is a tool by Anadea developers for
  checking entry points in the pre-commit config with ShellCheck.
promote:
  promote: false
top: false
authors:
  - eugene-pasko
categories:
  - development
industries: []
---
## The reasoning
Second-checking of an already written code may be an exhausting and unreliable task for most of the programmers involved in <a href="https://anadea.info/services/custom-software-development" target="_blank">custom software development</a>. While refactoring the code a few days ago, we found some mistakes in shell code in the pre-commit config file. These errors have been there for a long time without any warnings. That's why we thought if these code checks either were more reliable or proceeded automatically. Thereafter, <a href="https://github.com/Anadea/pre-commit-config-shellcheck" target="_blank">pre-commit-config-shellcheck</a> was created for this very purpose.

## What’s the difference
This tool will automatically detect and help you to resolve mistakes in your project’s <code>.pre-commit-config.yaml</code> file. All the syntax and most semantic checks are done for you. Also, you will receive bug fixing recommendations. This is done by automatic check of all the shell code entries in the config file with the other tool—_Shellcheck_.

## How it works
### Shellcheck
<a href="https://github.com/koalaman/shellcheck" target="_blank" rel="nofollow">Shellcheck</a> is a shell script static analysis tool. The main purpose of this tool is to find popular syntax mistakes as well as to point out corner cases that may cause scripts to fail under future circumstances while giving suggestions for fixing those.

### File checking
All the checks of this tool are done on the <code>.pre-commit-config.yaml</code> file, but this file can’t be directly analyzed by Shellcheck due to the structure of the file, which includes not only shell code but other configuration points. We found the workaround for this in creating a list of temporary files with found shell entry points and checking them separately.

### Subprocesses
The main way of using Shellcheck is through a terminal, and this tool doesn’t have an adaptor for different programming languages, so we use the Python subprocess module in order to perform checks on each temporary file. Then the output from subprocesses is collected and the tool forms a single pre-commit-config-shellcheck output with the list of warnings and their locations.

Example of usage and output:

<script id="asciicast-514275" src="https://asciinema.org/a/514275.js" data-cols="100" async></script>

### Easy to use
For the sake of keeping this tool simple for users, there are a few ways to use pre-commit-config-shellcheck:

#### As a command-line tool

  $ pip install pre-commit-config-shellcheck
  $ pre_commit_config_shellcheck.py .pre-commit-config.yaml

#### As the <u><a href="https://pre-commit.com/" target="_blank" rel="_nofollow">pre-commit</a></u> hook

```yaml
# .pre-commit-config.yaml
- repo: "https://github.com/Anadea/pre-commit-config-shellcheck"
 rev: "0.3.4"
 hooks:
  - id: "pre-commit-config-shellcheck"
```

#### And also as a <u><a href="https://github.com/features/actions/" target="_blank" rel="nofollow">GitHub action</a></u>

```yaml
- name: "pre-commit-config-shellcheck"
 uses: "action/pre-commit-config-shellcheck@0.3.4"
 id: "pre-commit-config-shellcheck"
 with:
  config: ".pre-commit-config.yaml"
```

## Conclusion
Pre-commit-config-shellcheck was successfully created, tested and deployed for third-party usage according to the licensing.
This tool, additional information and licensing can be found on GitHub: <a href="https://github.com/Anadea/pre-commit-config-shellcheck" target="_blank">https://github.com/Anadea/pre-commit-config-shellcheck</a>.
