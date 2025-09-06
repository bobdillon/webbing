# 🕹️ Arcade Chassis Repair Assistant

## The Problem
Vintage arcade machines are complex beasts. The 'chassis' is the complete monitor assembly - the CRT tube and all the circuit boards that drive the display". When a chassis fails, diagnosing the issue can take hours or even days of circuit level repair and testing. Traditional repair manuals are scattered, incomplete, usually poor quality scans, and almost always written in technical jargon that assumes years of experience.

## The Solution
I built an AI-powered **RAG (Retrieval-Augmented Generation) system** that acts as your personal arcade repair expert. Simply describe the symptoms, and the system will:

- Analyze your description against a comprehensive knowledge base
- Suggest the most likely causes based on symptoms
- Provide step-by-step troubleshooting instructions
- Recommend specific tools and replacement parts
- Recommend youtube videos with timestamps relevant to the exact problem

## Technical Implementation
- **Stack** Python-based RAG system using OpenAI embeddings, OAISS vector DB, plotly dash + some js for microphone
- **Knowledge Base**: Curated from repair manuals, forum discussions, youtube transcripts, and expert knowledge
- **Deployment**: Hosted on DigitalOcean 
## Impact
This tool has already helped me repair a handful of chassis. It's particularly valuable for newcomers to the hobby who lack the deep technical knowledge that comes with years of experience.

**[Try the Live Demo](https://chassis-repair-app-r3rnc.ondigitalocean.app/)**

## What's Next
I'm working on expanding the knowledge base for sure, and considering adding support for:
- Photo-based diagnostics using computer vision
- Integration with parts suppliers for automated ordering
- Clean up/ tune suggested prompts area so curious onlookers can better get a first taste.

## Feedback and thoughts
- Its kinda jank. Memory summarizes last 3 responses as you proceed, but thats just kind of ok
- Dash always defaults to non-obvious loading indicator
- Seems to really like the youtube transcripts over all else. Need to do some DE and rebuild the vectors.
- Latency is mid. Not bad for a weekender though. 
