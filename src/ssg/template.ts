import { PreviousPath } from "../types";

/**
 * Creates a HTML page from a template.
 * @param params defines the attributes and body of the HTML page.
 * @returns a string representing a HTML page.
 */
export function getHTML(params: {
  attributes: {
    title: string;
    createdAt: string;
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
            <div class="content">
                <h1>${params.attributes.title}</h1>
                <p>${params.attributes.createdAt}</p>
                <hr />
                <main>${params.body}</main>
            </div>
        </body>
    </html>
    `.trim();
}
