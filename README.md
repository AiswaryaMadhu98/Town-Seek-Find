# Town Seek and Find

A hidden object game on an illustrated town map, with a live leaderboard. One Node file, no dependencies.

The town has a hospital, school, garden park with a pond, market, allotment garden, houses with a swimming pool, shops, a harbor with a pier and boats, a lighthouse, a river, a beach and the sea. Players must find one named item, for example a coconut with a red straw. Lookalikes are hidden around the town too, such as coconuts with other colours of straw, plain ones, and cut ones. Other items are hidden as clutter.

## Run it on your computer

    node server.js

Open http://localhost:3000

## Host it on Render

1. Create a new GitHub repository and push this folder to it.
2. In Render, choose New, then Web Service, and connect that repository.
3. Use these settings:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free is enough for a meeting
4. Click Create Web Service. When the deploy finishes, Render gives you a public URL. Share that URL with the team.

## Before the meeting

- Free instances go to sleep after about 15 minutes without visits. Open the URL yourself 5 minutes before the meeting so it is awake. The first load after sleep can take about a minute.
- Scores are kept in memory and in a scores.json file. A restart or redeploy on the free plan clears them, which is fine for one session.

## How a game runs

1. The host opens the page and taps Host a hunt.
2. The host picks what to hide (Coconut, Rubber duck, Key, Balloon or Ice cream) and where, or picks Surprise me. There are 30 hiding places, for example floating in the park pond, on the hospital helipad, on a rooftop, in the swimming pool, at the end of the pier.
3. The host taps Create hunt and posts the 4 character code in the meeting chat.
4. Each player opens the URL, enters a name and the code, and taps Join hunt.
5. Players see the item to find at the bottom of the screen. Items stay hidden until the player zooms in, so they must zoom in and search.
6. Once zoomed in, the crosshair in the middle of the map and the Temperature panel show how close the centre of the map is to the item: Freezing, Cold, Warm, Hot or Burning, plus Getting warmer or Getting colder as they move. The crosshair pulses when it is Hot or Burning.
7. The player taps the exact item. About 40 items are hidden in every round, mostly lookalikes, so near the item the player must check the details. A wrong tap shows what that item really is, crosses it out and adds 5 seconds. Tapping the right one stops the clock, shows a celebration and the leaderboard.
8. After 30 seconds a player can take a hint that names the area. After 60 seconds a second hint shades a circle around the item. Each hint adds 20 seconds.
9. The host can watch the leaderboard from the Leaderboard button on the code screen. It refreshes every 5 seconds.

Each code has its own leaderboard, so for another round make a new hunt with a different item or place. A player's best time per code is kept. Practice hunts and the host's Test the hunt are not ranked.
