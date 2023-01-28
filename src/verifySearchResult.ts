import { SearchResult } from './fetchSearchResults';
import { userInput } from './utils';

export default async function verifySearchResult(result: SearchResult): Promise<boolean> {
  console.log('The following tags were extracted from iTunes:');
  console.log('Title: ' + result.trackName);
  console.log('Artist: ' + result.artistName);
  let verified: boolean | null = null;
  while (verified === null) {
    const userSelection = (await userInput('Please verify (y/n): ')).toLowerCase();
    if (userSelection === 'y' || userSelection == 'yes') {
      verified = true;
    } else if (userSelection === 'n' || userSelection == 'no') {
      verified = false;
    } else {
      console.error('Invalid selection, try again!');
    }
  }
  return verified;
}
