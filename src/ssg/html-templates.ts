import { PreviousPath } from "../types";

/**
 * Creates a HTML page from a template.
 * @param params defines the attributes and body of the HTML page.
 * @returns a string representing a HTML page.
 */
export function useHTMLTemplate(params: {
  attributes: {
    title: string;
  };
  body: string;
  previousPaths: PreviousPath[];
}) {
  const navigation = params.previousPaths
    .map(
      (previousPath) =>
        `<a href="/${previousPath.path}">${previousPath.title}</a>`
    )
    .join(" > ");

  return `
    <!DOCTYPE html>
    <html lang="en" class="h-full w-full">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${params.attributes.title}</title>
            <link href="/styles.css" rel="stylesheet">
        </head>
        <body class="h-screen w-screen p-8 flex flex-col items-center">
            <div class="flex-1 max-w-screen-md flex flex-col">
                <header>
                    ${navigation}
                </header>
                <main class="text-lg flex-1">${params.body}</main>
                <footer>
                  <p>Esse jardim é um projeto <i>open source</i>.</p>
                  <p>Confira o código fonte <a href="https://github.com/ighour/my-digital-garden" target="_blank">aqui</a>.</p>
                </footer>
            </div>
        </body>
    </html>
    `.trim();
}
