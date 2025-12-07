import { MOVIES } from "@consumet/extensions";

console.log("Available MOVIES providers:", Object.keys(MOVIES));

// Instantiate the provider
const dramacool = new MOVIES.DramaCool();

async function testConsumet() {
  try {
    console.log("Searching for 'Istriku, Wanita Mematikan'...");
    const search = await dramacool.search("Istriku, Wanita Mematikan");
    
    if (!search.results || search.results.length === 0) {
      console.error("No results found.");
      return;
    }

    console.log(`Found ${search.results.length} results.`);
    const firstItem = search.results[0];
    console.log("First result:", firstItem);

    console.log(`\nFetching info for: ${firstItem.id}...`);
    const info = await dramacool.fetchMediaInfo(firstItem.id);
    console.log("Title:", info.title);
    console.log("Episodes:", info.episodes?.length);

    if (info.episodes?.length > 0) {
      const firstEp = info.episodes[0];
      console.log(`\nFetching stream for episode: ${firstEp.id}...`);
      const sources = await dramacool.fetchEpisodeSources(firstEp.id, info.id);
      console.log("Sources found:", sources.sources?.length);
      console.log("First Source URL:", sources.sources?.[0]?.url);
    }

  } catch (error) {
    console.error("Consumet Error:", error);
  }
}

testConsumet();
