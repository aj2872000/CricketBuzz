const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Blog = require('./models/Blog');

const sampleBlogs = [
  {
    title: 'CSK vs MI: The Rivalry That Defines IPL',
    content: `<h2>Two Giants, One Stage</h2>
<p>When Chennai Super Kings take on Mumbai Indians, it's more than just a cricket match. It's a clash of philosophies, legacies, and fan emotions that transcends the boundaries of the sport itself.</p>
<h2>Head-to-Head Record</h2>
<p>Over the years, these two franchises have met in some of the most memorable encounters in IPL history. From last-ball thrillers to complete dominations, every chapter adds to a rich tapestry of rivalry.</p>
<h2>Key Battlegrounds</h2>
<p>The contest between MS Dhoni's cool-headed captaincy and Rohit Sharma's tactical acumen has always been the centerpiece of this rivalry. While both players are now veterans, their influence on their respective franchises remains undiminished.</p>
<blockquote>Cricket is not just about runs and wickets — it's about the stories that unfold on the field.</blockquote>
<h2>What to Expect This Season</h2>
<p>With fresh talent injected through auctions and experienced heads leading the charge, both squads are better equipped than ever. Fans can expect edge-of-the-seat action every time these two meet.</p>`,
    author: 'Vikram Nair',
    tags: ['CSK', 'MI', 'Analysis'],
    excerpt: 'The CSK vs MI rivalry is the crown jewel of IPL — a clash that goes beyond cricket into legacy, emotion, and drama.',
    published: true,
  },
  {
    title: 'RCB\'s Quest for the Trophy: 2024 Season Preview',
    content: `<h2>The Chase Continues</h2>
<p>Royal Challengers Bangalore — the team that has won the hearts of millions while the trophy has remained elusive. But every season brings renewed hope, and 2024 is no different.</p>
<h2>Squad Strength</h2>
<p>With Virat Kohli leading the batting charge alongside Faf du Plessis, RCB's top order has rarely looked this balanced. The middle order has been strengthened, and for once, their bowling attack has genuine match-winning potential.</p>
<h2>The Kohli Factor</h2>
<p>When Virat Kohli is in form, RCB is a completely different team. His ability to anchor the innings while playing at a high strike rate remains unmatched in T20 cricket.</p>
<h2>Can This Be Their Year?</h2>
<p>The conditions, squad depth, and sheer desire all point in one direction: this could finally be RCB's year. But cricket, as always, will have the last word.</p>`,
    author: 'Priya Menon',
    tags: ['RCB', 'Analysis', 'Opinion'],
    published: true,
  },
  {
    title: 'Top 5 Player Auctions That Transformed IPL Teams',
    content: `<h2>Money, Strategy, and Transformation</h2>
<p>The IPL auction is where franchises are built, rebuilt, and sometimes revolutionized overnight. Here are five auction decisions that completely changed the course of a team's journey.</p>
<h2>1. Ben Stokes to Rajasthan Royals</h2>
<p>A record-breaking buy that signaled a new era of aggressive spending on overseas all-rounders. Stokes brought not just runs and wickets but an attitude that electrified the entire squad.</p>
<h2>2. Pat Cummins to KKR</h2>
<p>Appointing a world-class fast bowler as captain was a bold gamble — one that paid dividends as KKR transformed their team culture and playing style.</p>
<h2>3. Shreyas Iyer's Mega Return</h2>
<p>Every mega auction has its headline story, and Iyer's return to KKR at a premium proved that performance commands premium even in the most competitive bidding environment.</p>
<h2>Looking Ahead</h2>
<p>As franchise strategies evolve, the auction will remain the most theatrical and consequential event in the IPL calendar.</p>`,
    author: 'Arjun Patel',
    tags: ['Stats', 'Analysis', 'Transfer News'],
    published: true,
  },
  {
    title: 'Jasprit Bumrah: The Art of Bowling Unplayable Yorkers',
    content: `<h2>Science Behind the Skill</h2>
<p>Jasprit Bumrah's yorker is arguably the most destructive delivery in modern T20 cricket. What makes it so difficult to play, and how has he perfected it over the years?</p>
<h2>The Biomechanics</h2>
<p>Bumrah's unorthodox bowling action — with that distinctive front-on delivery stride — creates unusual angles that batsmen simply aren't programmed to deal with. The ball skids low and fast, leaving minimal reaction time.</p>
<h2>Death Overs Mastery</h2>
<p>In the death overs, when batsmen are trying to clear the boundary ropes, Bumrah's ability to consistently hit the base of off stump has won MI crucial points in close encounters across multiple seasons.</p>
<h2>The Mental Game</h2>
<p>Beyond technique, there's a psychological element. Bumrah rarely betrays emotion, creating a pressure that extends beyond any individual delivery to an entire spell.</p>`,
    author: 'Suresh Kumar',
    tags: ['MI', 'Stats', 'Analysis'],
    published: true,
  },
  {
    title: 'Fantasy Cricket: Best XI Picks for IPL 2024 Opener',
    content: `<h2>Your Dream Team Guide</h2>
<p>The season opener is here, and fantasy cricket enthusiasts are furiously assembling their teams. Here's our expert analysis to help you get ahead of the competition.</p>
<h2>Must-Have Batters</h2>
<p>Shubman Gill has been in scintillating form and should be an automatic pick. His consistency at the top of the order, combined with a high strike rate in powerplay overs, makes him a fantasy goldmine.</p>
<h2>Bowling Picks</h2>
<p>Death-over specialists are premium picks in fantasy. Bumrah, Rashid Khan, and Kuldeep Yadav offer the best combination of economy and wicket-taking ability across different conditions.</p>
<h2>The Differential Pick</h2>
<p>In fantasy cricket, the match-winner is often someone fewer than 15% of teams have selected. This week's differential: a middle-order finisher who has been quietly destroying attacks in the nets.</p>`,
    author: 'Neha Sharma',
    tags: ['Fantasy', 'Stats'],
    published: true,
  },
  {
    title: 'The Rise of Gujarat Titans: From Newcomers to Champions',
    content: `<h2>A Championship Story</h2>
<p>When Gujarat Titans entered the IPL in 2022, expectations were modest. By the end of their debut season, they were champions. The story of their rise is one of the most remarkable in sports.</p>
<h2>Hardik Pandya's Leadership</h2>
<p>Under Hardik Pandya's captaincy, GT played a brand of cricket that was refreshingly direct — no overthinking, no hesitation, just aggressive, confident play from ball one.</p>
<h2>Building Through the Auction</h2>
<p>GT's auction strategy was masterful: targeting value picks and experienced heads who could mentor a young squad. The balance between domestic talent and quality overseas players was near-perfect.</p>
<h2>Sustaining Success</h2>
<p>The true test of a franchise is not the first title but the ability to sustain excellence. GT's infrastructure, coaching staff, and team culture suggest this is a franchise built for the long term.</p>`,
    author: 'Rahul Desai',
    tags: ['GT', 'Analysis', 'Match Report'],
    published: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Blog.deleteMany({});
    console.log('🗑  Cleared existing blogs');

    const created = await Blog.insertMany(sampleBlogs);
    console.log(`🌱 Seeded ${created.length} sample blog posts`);

    console.log('\nCreated blogs:');
    created.forEach((b) => console.log(`  - "${b.title}" → /blog/${b.slug}`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
