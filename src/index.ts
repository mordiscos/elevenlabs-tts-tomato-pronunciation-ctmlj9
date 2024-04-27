import { ElevenLabsClient } from "elevenlabs";
import fs from "fs";

async function main() {
    const elevenlabs = new ElevenLabsClient({ apiKey: "YOUR_API_KEY" });

    // Step 1: Create a Pronunciation Dictionary from a File
    const fileStream = fs.createReadStream("/path/to/phonemes.pls");
    const pronunciationDict = await elevenlabs.pronunciationDictionary.addFromFile(fileStream, {
        name: "TomatoPhonemes"
    });

    // Step 2: Generate and Play Audio
    let audioStream = await elevenlabs.textToSpeech.convert("Rachel", {
        text: "tomato",
        pronunciation_dictionary_locators: [pronunciationDict.id]
    });
    play(audioStream);

    // Step 3: Remove the "tomato" Rule from the Pronunciation Dictionary
    await elevenlabs.pronunciationDictionary.removeRulesFromThePronunciationDictionary(pronunciationDict.id, {
        rule_strings: ["tomato", "Tomato"] // Assuming these are the identifiers for the rules
    });

    // Step 4: Generate and Play Audio Again without Custom Pronunciation
    audioStream = await elevenlabs.textToSpeech.convert("Rachel", {
        text: "tomato"
    });
    play(audioStream);

    // Step 5: Add the Rule "tomato" Again Using its Phoneme
    await elevenlabs.pronunciationDictionary.addRulesToThePronunciationDictionary(pronunciationDict.id, {
        rules: [{ type: "phoneme", string_to_replace: "tomato", phoneme: "təˈmeɪtoʊ", alphabet: "IPA" }]
    });

    // Step 6: Generate and Play Audio with the Re-added Rule
    audioStream = await elevenlabs.textToSpeech.convert("Rachel", {
        text: "tomato",
        pronunciation_dictionary_locators: [pronunciationDict.id]
    });
    play(audioStream);
}

function play(audioStream: any) {
    // Assume play is a function that can handle the audio stream
    console.log("Playing audio...");
    // Logic to play the audio stream would be implemented here
}

main().catch(console.error);
