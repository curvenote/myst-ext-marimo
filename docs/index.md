---
title: Example
---

```{marimo}
:name: marimo-island
:caption: Marimo Island Example
:app-id: main
:version: 0.6.2

import marimo as mo
import sys

if "pyodide" in sys.modules:
    import micropip
    await micropip.install('cowsay')

import cowsay
cow_string = cowsay.get_output_string('cow', 'Hello, Marimo!!!')
cow_string
```
