const initialCode = `
\\documentclass{article}
\\begin{document}

\\title{Sample LaTeX Document}
\\author{Monkey D. Luffy}
\\date{\\today}

\\maketitle

\\section{Introduction}
One Piece is Real

\\section{Mathematics}
Here is an inline equation: $E = mc^2$

\\section{Lists}
\\subsection{Unordered List}
\\begin{itemize}
  \\item Item 1
  \\item Item 2
  \\item Item 3
\\end{itemize}

\\subsection{Ordered List}
\\begin{enumerate}
  \\item First item
  \\item Second item
  \\item Third item
\\end{enumerate}

\\section{Conclusion}

\\end{document}
`;

export default initialCode