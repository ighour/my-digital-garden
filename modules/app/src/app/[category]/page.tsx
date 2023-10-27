import { getCategories, getCategory } from "@/utils/data";

export default function CategoryPage({ category }) {
    return (
        <main>
            {JSON.stringify(category)}
        </main>
    )
}

export async function getStaticPaths() {
    const categories = await getCategories();
    const slugs = categories.map(category => category.slug);
    return {
        paths: slugs,
        fallback: false,
    }
}

export async function getStaticProps({ params }) {
    const categorySlug = params.category;
    const category = await getCategory(categorySlug);
    return {
        props: {
            category,
        }
    };
}