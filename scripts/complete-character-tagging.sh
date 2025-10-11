#!/bin/bash

# Complete character tagging workflow
# This script waits for face-tagger to complete, then runs character mapping

echo "🎯 Complete Character Tagging Workflow"
echo "======================================"
echo ""

# Check if face-tagger is running
if pgrep -f "face-tagger-parallel" > /dev/null; then
    echo "⏳ Face-tagger is still running. Monitoring progress..."
    echo "📊 Watching /tmp/face-tagger.log"
    echo ""

    # Monitor log file for completion
    tail -f /tmp/face-tagger.log | while read line; do
        echo "$line"

        # Check if we've reached completion message
        if echo "$line" | grep -q "Face tagging completed"; then
            echo ""
            echo "✅ Face-tagger completed!"
            pkill -P $$ tail  # Kill the tail process
            break
        fi
    done
fi

echo ""
echo "🔄 Running cluster analysis..."
pnpm analyze-clusters

echo ""
echo "🎨 Running character inference..."
echo "💡 You'll be prompted to identify each character using dialogue context"
echo ""

pnpm infer-character-mapping

echo ""
echo "🏷️  Tagging all frames with character names..."
pnpm tag-frames

echo ""
echo "✅ Character tagging workflow complete!"
echo "📁 Output files:"
echo "   - public/character-mapping.json"
echo "   - public/frame-characters.json"
echo ""
echo "🎉 All frames are now tagged with character information!"
