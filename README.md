# tailwind-enhanced README

This VSCode extension aims to help you writing tailwindcss classes faster.

## Features

### Auto completion for arbitrary value

just type arbitrary value such as `text22p` or `w4#5r`(4#5 stands for 4.5), and this extension will auto complete it as `text-[22px]` or `w-[4.5rem]`.

The abbr is composed with three parts: `prefix`(text/w/h/...), `arbitrary value`(integer/float number, with sharp `#` stands for dot `.`), `suffix`(p for px, r for rem).

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Known Issues

- For float number such as `4.5` as arbitrary value, it has to be written as `4#5` to make auto completion work.

## Release Notes

### 0.0.1

Added features:

- auto completion for arbitrary value

**Enjoy!**
