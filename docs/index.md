---
title: homepage
---

```{marimo}
import marimo as mo
import sys

if "pyodide" in sys.modules:
    import micropip
    await micropip.install('cowsay')

import cowsay
cowsay.get_output_string('cow', 'Hello, marimo!!!')
```
