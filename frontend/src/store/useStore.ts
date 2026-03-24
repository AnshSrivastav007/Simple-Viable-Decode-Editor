import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export interface Language {
  id: string;
  name: string;
  extension: string;
  monacoId: string;
  icon: string;
  template: string;
}

export interface Snippet {
  id: string;
  code: string;
  languageId: string;
  createdAt: number;
  title: string;
}

interface EditorState {
  code: string;
  selectedLanguage: Language | null;
  theme: 'dark' | 'light';
  languages: Language[];
  lastSync: number | null;
  isExecuting: boolean;
  output: string;
  snippets: Snippet[];
  currentSnippetId: string | null;
  
  setCode: (code: string) => void;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
  setLanguages: (languages: Language[]) => void;
  setLastSync: (time: number) => void;
  setIsExecuting: (executing: boolean) => void;
  setOutput: (output: string) => void;
  saveSnippet: (title: string) => Snippet;
  loadSnippet: (id: string) => void;
  clearOutput: () => void;
}

const defaultLanguages: Language[] = [
  { id: '1', name: 'JavaScript', extension: '.js', monacoId: 'javascript', icon: '🟨', template: '// JavaScript\nconsole.log("Hello, World!");' },
  { id: '2', name: 'TypeScript', extension: '.ts', monacoId: 'typescript', icon: '🔷', template: '// TypeScript\nconst greeting: string = "Hello, World!";\nconsole.log(greeting);' },
  { id: '3', name: 'Python', extension: '.py', monacoId: 'python', icon: '🐍', template: '# Python\nprint("Hello, World!")' },
  { id: '4', name: 'Java', extension: '.java', monacoId: 'java', icon: '☕', template: '// Java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
  { id: '5', name: 'C++', extension: '.cpp', monacoId: 'cpp', icon: '⚙️', template: '// C++\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}' },
  { id: '6', name: 'C', extension: '.c', monacoId: 'c', icon: '🔧', template: '// C\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}' },
  { id: '7', name: 'C#', extension: '.cs', monacoId: 'csharp', icon: '💜', template: '// C#\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}' },
  { id: '8', name: 'Go', extension: '.go', monacoId: 'go', icon: '🐹', template: '// Go\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}' },
  { id: '9', name: 'Rust', extension: '.rs', monacoId: 'rust', icon: '🦀', template: '// Rust\nfn main() {\n    println!("Hello, World!");\n}' },
  { id: '10', name: 'Ruby', extension: '.rb', monacoId: 'ruby', icon: '💎', template: '# Ruby\nputs "Hello, World!"' },
  { id: '11', name: 'PHP', extension: '.php', monacoId: 'php', icon: '🐘', template: '<?php\n// PHP\necho "Hello, World!";' },
  { id: '12', name: 'Swift', extension: '.swift', monacoId: 'swift', icon: '🍎', template: '// Swift\nprint("Hello, World!")' },
  { id: '13', name: 'Kotlin', extension: '.kt', monacoId: 'kotlin', icon: '🟣', template: '// Kotlin\nfun main() {\n    println("Hello, World!")\n}' },
  { id: '14', name: 'Scala', extension: '.scala', monacoId: 'scala', icon: '🔴', template: '// Scala\nobject Main extends App {\n    println("Hello, World!")\n}' },
  { id: '15', name: 'Dart', extension: '.dart', monacoId: 'dart', icon: '🎯', template: '// Dart\nvoid main() {\n  print("Hello, World!");\n}' },
  { id: '16', name: 'Lua', extension: '.lua', monacoId: 'lua', icon: '🌙', template: '-- Lua\nprint("Hello, World!")' },
  { id: '17', name: 'Perl', extension: '.pl', monacoId: 'perl', icon: '🐪', template: '# Perl\nprint "Hello, World!\\n";' },
  { id: '18', name: 'R', extension: '.r', monacoId: 'r', icon: '📊', template: '# R\nprint("Hello, World!")' },
  { id: '19', name: 'Julia', extension: '.jl', monacoId: 'julia', icon: '🟢', template: '# Julia\nprintln("Hello, World!")' },
  { id: '20', name: 'Haskell', extension: '.hs', monacoId: 'haskell', icon: 'λ', template: '-- Haskell\nmain = putStrLn "Hello, World!"' },
  { id: '21', name: 'Elixir', extension: '.ex', monacoId: 'elixir', icon: '💧', template: '# Elixir\nIO.puts "Hello, World!"' },
  { id: '22', name: 'Clojure', extension: '.clj', monacoId: 'clojure', icon: '🟩', template: '; Clojure\n(println "Hello, World!")' },
  { id: '23', name: 'F#', extension: '.fs', monacoId: 'fsharp', icon: '🔵', template: '// F#\nprintfn "Hello, World!"' },
  { id: '24', name: 'OCaml', extension: '.ml', monacoId: 'ocaml', icon: '🐫', template: '(* OCaml *)\nprint_endline "Hello, World!"' },
  { id: '25', name: 'Erlang', extension: '.erl', monacoId: 'erlang', icon: '📡', template: '% Erlang\n-module(hello).\n-export([world/0]).\n\nworld() -> io:fwrite("Hello, World!~n").' },
  { id: '26', name: 'Assembly', extension: '.asm', monacoId: 'assembly', icon: '🔩', template: '; Assembly (x86)\nsection .data\n    msg db "Hello, World!", 0\n\nsection .text\n    global _start\n\n_start:\n    ; code here' },
  { id: '27', name: 'COBOL', extension: '.cbl', monacoId: 'cobol', icon: '🏛️', template: '       IDENTIFICATION DIVISION.\n       PROGRAM-ID. HELLO.\n       PROCEDURE DIVISION.\n           DISPLAY "Hello, World!".\n           STOP RUN.' },
  { id: '28', name: 'Fortran', extension: '.f90', monacoId: 'fortran', icon: '🔬', template: '! Fortran\nprogram hello\n    print *, "Hello, World!"\nend program hello' },
  { id: '29', name: 'Pascal', extension: '.pas', monacoId: 'pascal', icon: '📐', template: '{ Pascal }\nprogram Hello;\nbegin\n    writeln(\'Hello, World!\');\nend.' },
  { id: '30', name: 'SQL', extension: '.sql', monacoId: 'sql', icon: '🗃️', template: '-- SQL\nSELECT \'Hello, World!\' AS greeting;' },
  { id: '31', name: 'HTML', extension: '.html', monacoId: 'html', icon: '🌐', template: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>' },
  { id: '32', name: 'CSS', extension: '.css', monacoId: 'css', icon: '🎨', template: '/* CSS */\nbody {\n    font-family: Arial, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n}' },
  { id: '33', name: 'SCSS', extension: '.scss', monacoId: 'scss', icon: '🎨', template: '// SCSS\n$primary-color: #667eea;\n\nbody {\n    background: $primary-color;\n    \n    h1 {\n        color: white;\n    }\n}' },
  { id: '34', name: 'JSON', extension: '.json', monacoId: 'json', icon: '📋', template: '{\n    "greeting": "Hello, World!",\n    "version": "1.0.0"\n}' },
  { id: '35', name: 'YAML', extension: '.yaml', monacoId: 'yaml', icon: '📄', template: '# YAML\ngreeting: Hello, World!\nversion: 1.0.0' },
  { id: '36', name: 'XML', extension: '.xml', monacoId: 'xml', icon: '📰', template: '<?xml version="1.0" encoding="UTF-8"?>\n<greeting>\n    <message>Hello, World!</message>\n</greeting>' },
  { id: '37', name: 'Markdown', extension: '.md', monacoId: 'markdown', icon: '📝', template: '# Hello, World!\n\nThis is a **Markdown** document.\n\n- Item 1\n- Item 2\n- Item 3' },
  { id: '38', name: 'Shell', extension: '.sh', monacoId: 'shell', icon: '🐚', template: '#!/bin/bash\n# Shell Script\necho "Hello, World!"' },
  { id: '39', name: 'PowerShell', extension: '.ps1', monacoId: 'powershell', icon: '💠', template: '# PowerShell\nWrite-Host "Hello, World!"' },
  { id: '40', name: 'Batch', extension: '.bat', monacoId: 'bat', icon: '🪟', template: '@echo off\nREM Batch Script\necho Hello, World!' },
  { id: '41', name: 'Dockerfile', extension: '', monacoId: 'dockerfile', icon: '🐳', template: '# Dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["npm", "start"]' },
  { id: '42', name: 'GraphQL', extension: '.graphql', monacoId: 'graphql', icon: '◢', template: '# GraphQL\ntype Query {\n    hello: String\n}\n\nquery {\n    hello\n}' },
  { id: '43', name: 'Groovy', extension: '.groovy', monacoId: 'groovy', icon: '⭐', template: '// Groovy\nprintln "Hello, World!"' },
  { id: '44', name: 'VB.NET', extension: '.vb', monacoId: 'vb', icon: '🟦', template: "' VB.NET\nModule Program\n    Sub Main()\n        Console.WriteLine(\"Hello, World!\")\n    End Sub\nEnd Module" },
  { id: '45', name: 'Objective-C', extension: '.m', monacoId: 'objective-c', icon: '🍏', template: '// Objective-C\n#import <Foundation/Foundation.h>\n\nint main() {\n    @autoreleasepool {\n        NSLog(@"Hello, World!");\n    }\n    return 0;\n}' },
  { id: '46', name: 'CoffeeScript', extension: '.coffee', monacoId: 'coffeescript', icon: '☕', template: '# CoffeeScript\nconsole.log "Hello, World!"' },
  { id: '47', name: 'Nim', extension: '.nim', monacoId: 'nim', icon: '👑', template: '# Nim\necho "Hello, World!"' },
  { id: '48', name: 'Crystal', extension: '.cr', monacoId: 'crystal', icon: '💠', template: '# Crystal\nputs "Hello, World!"' },
  { id: '49', name: 'Zig', extension: '.zig', monacoId: 'zig', icon: '⚡', template: '// Zig\nconst std = @import("std");\n\npub fn main() void {\n    std.debug.print("Hello, World!\\n", .{});\n}' },
  { id: '50', name: 'V', extension: '.v', monacoId: 'v', icon: '🔷', template: '// V\nfn main() {\n    println(\'Hello, World!\')\n}' },
  { id: '51', name: 'Solidity', extension: '.sol', monacoId: 'sol', icon: '⟠', template: '// Solidity\npragma solidity ^0.8.0;\n\ncontract HelloWorld {\n    string public greeting = "Hello, World!";\n}' },
  { id: '52', name: 'Prolog', extension: '.pl', monacoId: 'prolog', icon: '🧠', template: '% Prolog\nhello :- write(\'Hello, World!\'), nl.' },
  { id: '53', name: 'Scheme', extension: '.scm', monacoId: 'scheme', icon: '🔵', template: '; Scheme\n(display "Hello, World!")\n(newline)' },
  { id: '54', name: 'Lisp', extension: '.lisp', monacoId: 'lisp', icon: '🟠', template: '; Lisp\n(print "Hello, World!")' },
  { id: '55', name: 'MATLAB', extension: '.m', monacoId: 'matlab', icon: '📈', template: '% MATLAB\ndisp(\'Hello, World!\')' },
  { id: '56', name: 'D', extension: '.d', monacoId: 'd', icon: '🔶', template: '// D\nimport std.stdio;\n\nvoid main() {\n    writeln("Hello, World!");\n}' },
  { id: '57', name: 'Ada', extension: '.adb', monacoId: 'ada', icon: '🏛️', template: '-- Ada\nwith Ada.Text_IO;\n\nprocedure Hello is\nbegin\n    Ada.Text_IO.Put_Line("Hello, World!");\nend Hello;' },
  { id: '58', name: 'ReScript', extension: '.res', monacoId: 'rescript', icon: '🔴', template: '// ReScript\nJs.log("Hello, World!")' },
  { id: '59', name: 'Svelte', extension: '.svelte', monacoId: 'svelte', icon: '🧡', template: '<script>\n    let name = "World";\n</script>\n\n<h1>Hello, {name}!</h1>' },
  { id: '60', name: 'Vue', extension: '.vue', monacoId: 'vue', icon: '💚', template: '<template>\n    <h1>Hello, {{ name }}!</h1>\n</template>\n\n<script setup>\nconst name = "World";\n</script>' },
  { id: '61', name: 'Terraform', extension: '.tf', monacoId: 'hcl', icon: '🏗️', template: '# Terraform\nresource "null_resource" "hello" {\n  provisioner "local-exec" {\n    command = "echo Hello, World!"\n  }\n}' },
  { id: '62', name: 'TOML', extension: '.toml', monacoId: 'toml', icon: '⚙️', template: '# TOML\n[greeting]\nmessage = "Hello, World!"\nversion = "1.0.0"' },
];

export const useStore = create<EditorState>()(
  persist(
    (set, get) => ({
      code: defaultLanguages[0].template,
      selectedLanguage: defaultLanguages[0],
      theme: 'dark',
      languages: defaultLanguages,
      lastSync: Date.now(),
      isExecuting: false,
      output: '',
      snippets: [],
      currentSnippetId: null,

      setCode: (code) => set({ code }),
      
      setLanguage: (language) => set({ 
        selectedLanguage: language, 
        code: language.template 
      }),
      
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
      
      setLanguages: (languages) => set({ languages }),
      
      setLastSync: (time) => set({ lastSync: time }),
      
      setIsExecuting: (executing) => set({ isExecuting: executing }),
      
      setOutput: (output) => set({ output }),
      
      clearOutput: () => set({ output: '' }),
      
      saveSnippet: (title) => {
        const state = get();
        const snippet: Snippet = {
          id: nanoid(10),
          code: state.code,
          languageId: state.selectedLanguage?.id || '1',
          createdAt: Date.now(),
          title,
        };
        set((state) => ({
          snippets: [...state.snippets, snippet],
          currentSnippetId: snippet.id,
        }));
        return snippet;
      },
      
      loadSnippet: (id) => {
        const state = get();
        const snippet = state.snippets.find((s) => s.id === id);
        if (snippet) {
          const language = state.languages.find((l) => l.id === snippet.languageId);
          set({
            code: snippet.code,
            selectedLanguage: language || state.languages[0],
            currentSnippetId: id,
          });
        }
      },
    }),
    {
      name: 'svde-editor-storage',
      partialize: (state) => ({
        theme: state.theme,
        snippets: state.snippets,
        lastSync: state.lastSync,
      }),
    }
  )
);
