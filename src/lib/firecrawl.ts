
import FirecrawlApp from '@mendable/firecrawl-js';

const apiKey = process.env.FIRECRAWL_API_KEY;

// Initialize Firecrawl app if API key exists, otherwise it will fail gracefully when called
const firecrawlApp = apiKey ? new FirecrawlApp({ apiKey }) : null;

export interface WebSearchResult {
    title: string;
    description?: string;
    url: string;
    content?: string;
}

export async function searchWeb(query: string): Promise<WebSearchResult[]> {
    if (!firecrawlApp) {
        console.warn("Firecrawl: API Key missing. Skipping web search.");
        return [];
    }

    try {
        console.log("Firecrawl: Searching for", query);
        const searchResponse = await firecrawlApp.search(query, {
            pageOptions: {
                fetchPageContent: true, // Fetch content to provide context to LLM
            },
            searchOptions: {
                limit: 3 // Limit results to adding relevant context without overloading
            }
        });

        if (!searchResponse.success) {
            console.error("Firecrawl: Search failed", searchResponse.error);
            return [];
        }

        // Map response to a cleaner format
        return searchResponse.data.map((item: any) => ({
            title: item.title || "Untitled",
            description: item.description,
            url: item.url,
            content: item.markdown || item.content || "" // Prioritize markdown for LLM
        }));

    } catch (error) {
        console.error("Firecrawl: Exception during search", error);
        return [];
    }
}
