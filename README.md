# 🎮 Simon Says - rabbit r1 Creation

A classic Game Boy-style Simon Says memory game built for the rabbit r1 device. Test your memory with increasingly challenging sequences!

![Game Preview](https://img.shields.io/badge/Status-Ready%20to%20Play-brightgreen)

## 🕹️ Game Features

- **Classic Memory Challenge**: Remember and repeat increasingly longer sequences
- **Game Boy Aesthetic**: Retro black & white with authentic green screen tint
- **No Time Pressure**: Take your time to remember - pure memory game
- **Four Actions**: Scroll up, scroll down, button press, and shake
- **High Score Tracking**: Persistent high score saves across sessions
- **Retro Sound Effects**: Unique beep tones for each action

## 🎯 How to Play

1. **Watch** the sequence of actions displayed on screen
2. **Remember** the order (each action shows with its unique sound)
3. **Repeat** the sequence using your r1 controls:
   - ⬆️ Scroll Up
   - ⬇️ Scroll Down  
   - ⚫ Button Press (PTT)
   - ✱ Shake Device
4. **Progress**: Each successful round adds one more action to the sequence
5. **Challenge**: How long can you go?

## 📦 Installation on rabbit r1

### Option 1: QR Code (Easiest)

1. **Enable GitHub Pages** for this repo:
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main`
   - Save and wait for deployment

2. **Generate QR Code**:
   - Visit: https://rabbit-hmi-oss.github.io/creations-sdk/qr/
   - Enter:
     - **Name**: Simon Says
     - **Description**: Game Boy memory game
     - **URL**: `https://jjames1992.github.io/rabbit-r1-simon-says/`
   - Generate QR code

3. **Scan with r1**:
   - Open camera on your r1
   - Scan the generated QR code
   - Game installs automatically!

### Option 2: Manual URL Entry

1. Open Creations on your r1
2. Select "Add by URL"
3. Enter: `https://jjames1992.github.io/rabbit-r1-simon-says/`

## 🛠️ Technical Details

- **Screen Resolution**: 240x282px (portrait)
- **Controls**: Full r1 SDK integration
  - `scrollUp` / `scrollDown` events
  - `sideClick` event  
  - `accelerometer` for shake detection
- **Storage**: Uses `creationStorage.plain` API for high score persistence
- **Audio**: Web Audio API with retro square wave synthesis
- **Fallback**: Keyboard controls for desktop testing (↑↓ Space S)

## 🎨 Customization

Want to tweak the look? Edit these files:

- **styles.css**: Change colors, fonts, animations
  - Game Boy green: `#9bbc0f` / `#0f380f`
  - Adjust font sizes, spacing, effects
- **game.js**: Modify game logic
  - Change starting sequence length (line 79)
  - Adjust sound frequencies (lines 30-35)
  - Tune shake sensitivity (line 103)

## 📝 Game Stats

- **Starting Sequence**: 3 actions
- **Sequence Growth**: +1 action per round
- **Scoring**: Points equal sequence length
- **Action Display**: 600ms per action
- **Gap Between Actions**: 800ms

## 🐛 Testing Locally

```bash
# Clone the repo
git clone https://github.com/JJames1992/rabbit-r1-simon-says.git
cd rabbit-r1-simon-says

# Open in browser
# Use keyboard controls:
# ↑ = Scroll Up
# ↓ = Scroll Down
# Space/Enter = Button
# S = Shake
```

## 🚀 Future Ideas

- Difficulty modes (faster sequences)
- Different sound packs (chiptune, piano)
- Color themes (original Game Boy, Game Boy Color palettes)
- Practice mode (show sequence during input)
- Leaderboard integration

## 📄 License

MIT License - Feel free to modify and share!

## 🙏 Credits

Built with love for the rabbit r1 community
Based on [rabbit Creations SDK](https://github.com/rabbit-hmi-oss/creations-sdk)

---

**Ready to test your memory?** 🧠✨