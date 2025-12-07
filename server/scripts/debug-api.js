import { dramaDashClient } from "../src/services/dramaDashClient.js";

async function debug() {
  try {
    console.log("Searching for 'Istriku'...");
    const results = await dramaDashClient.search("Istriku");
    
    if (results.length === 0) {
      console.log("No results found.");
    } else {
      console.log(`Found ${results.length} results:`);
      results.forEach(item => {
        console.log(`- [${item.id}] ${item.title} (Popularity: ${item.popularity})`);
      });
    }

  } catch (error) {
    console.error("Debug failed:", error);
  }
}

debug();
