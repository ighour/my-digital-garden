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
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${params.attributes.title}</title>
        </head>
        <body>
            <header>
                ${navigation}
            </header>
            <div>
                <main>${params.body}</main>
                <footer style="margin-top: 40px; text-align: center">
                  <p style="margin: 0">Esse jardim é um projeto <i>open source</i>.</p>
                  <p style="margin: 0">Confira o código fonte <a href="https://github.com/ighour/my-digital-garden" target="_blank">aqui</a>.</p>
                </footer>
            </div>
        </body>
    </html>
    `.trim();
}
