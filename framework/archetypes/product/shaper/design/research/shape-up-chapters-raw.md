# Shape Up: Chapter Excerpts (Part 1: Shaping)

**Source**: Ryan Singer, *Shape Up* (Basecamp, 2019)
**URL**: https://basecamp.com/shapeup
**Chapters**: 1-6 (Introduction + Part 1: Shaping)
**Saved**: 2026-02-25

> This file contains curated direct excerpts from the shaping chapters for reference (not full verbatim chapter captures). The extracted patterns and analysis are in `shape-up-shaping.md`.

---

## Chapter 1: Introduction

Key passage -- Singer's background and the origin of shaping:

"From the first prototypes in July 2003 to launch in February 2004, David only worked ten hours a week. We knew we wouldn't get anywhere with those ten hours of programming unless we used them very deliberately. Our intense focus on 'hammering' the scope to fit within a given time budget was born under these constraints."

"Working with David and Ruby on Rails made the world of programming accessible to me. I learned the techniques programmers use to tame complexity: things like factoring, levels of abstraction, and separation of concerns. With one foot in the design world and one foot in the programming world, I wondered if we could apply these software development principles to the way we designed and managed the product."

"You can think of this as two books in one. First, it's a book of basic truths."

On shaping: "A small senior group works in parallel to the cycle teams. They define the key elements of a solution before we consider a project ready to bet on. Projects are defined at the right level of abstraction: concrete enough that the teams know what to do, yet abstract enough that they have room to work out the interesting details themselves."

On appetite vs estimation: "When shaping, we focus less on estimates and more on our appetite. Instead of asking how much time it will take to do some work, we ask: How much time do we want to spend? How much is this idea worth?"

On risk: "This book isn't about the risk of building the wrong thing... This book is about the risk of getting stuck, the risk of getting bogged down with last quarter's work, wasting time on unexpected problems, and not being free to do what you want to do tomorrow."

---

## Chapter 2: Principles of Shaping

"When we shape the work, we need to do it at the right level of abstraction: not too vague and not too concrete."

### Wireframes are too concrete

"When design leaders go straight to wireframes or high-fidelity mockups, they define too much detail too early. This leaves designers no room for creativity."

"Over-specifying the design also leads to estimation errors. Counterintuitive as it may seem, the more specific the work is, the harder it can be to estimate. That's because making the interface just so can require solving hidden complexities and implementation details that weren't visible in the mockup."

### Words are too abstract

"When a project is defined in a few words, nobody knows what it means. 'Build a calendar view' or 'add group notifications' sound sensible, but what exactly do they entail? Team members don't have enough information to make trade-offs."

"You're solving a problem with no context. You have to be a mind reader. It's like: 'we'll know it when we see it.'"

### The Dot Grid Calendar case study

"We had built calendars before and we knew how complex they are. It can easily take six months or more to build a proper calendar."

"Only about 10% of customers used them. That's why we didn't have the appetite for spending six months on a calendar."

"With only six weeks to work with, we could only build about a tenth of what people think of when they say 'calendar.' The question became: which tenth?"

"We could build a two-month, read-only grid view. Any day with an event would have a dot for each event. A list of events would appear below the calendar, and clicking a day with a dot would scroll the events for that day into view."

"The Dot Grid wasn't a full-featured calendar. We weren't going to allow dragging events between days. We weren't going to span multi-day events across the grid... We were comfortable with all these trade-offs because of our understanding of the use case."

### Three properties

"Property 1: It's rough. Everyone can tell by looking at it that it's unfinished. They can see the open spaces where their contributions will go."

"Property 2: It's solved. Despite being rough and unfinished, shaped work has been thought through. All the main elements of the solution are there at the macro level and they connect together."

"Property 3: It's bounded. Shaped work indicates what not to do. It tells the team where to stop."

"Taken together, the roughness leaves room for the team to resolve all the details, while the solution and boundaries act like guard rails. They reduce risk and channel the team's efforts, making sure they don't build too much, wander around, or get stuck."

### Who shapes

"Shaping is creative and integrative. It requires combining interface ideas with technical possibilities with business priorities."

"Shaping is primarily design work. The shaped concept is an interaction design viewed from the user's perspective. It defines what the feature does, how it works, and where it fits into existing flows."

"You don't need to be a programmer to shape, but you need to be technically literate. You should be able to judge what's possible, what's easy and what's hard."

"It's also strategic work. Setting the appetite and coming up with a solution requires you to be critical about the problem. What are we trying to solve? Why does it matter? What counts as success? Which customers are affected? What is the cost of doing this instead of something else?"

"Shaping is a closed-door, creative process. You might be alone sketching on paper or in front of a whiteboard with a close collaborator. There'll be rough diagrams in front of you that nobody outside the room would be able to interpret."

### Two tracks

"During any six week cycle, the teams are building work that's been previously shaped and the shapers are working on what the teams might potentially build in a future cycle. Work on the shaping track is kept private and not shared with the wider team until the commitment has been made to bet on it."

### Four steps

"1. Set boundaries. 2. Rough out the elements. 3. Address risks and rabbit holes. 4. Write the pitch."

---

## Chapter 3: Set Boundaries

### Setting the appetite

"Whether we're chomping at the bit or reluctant to dive in, it helps to explicitly define how much of our time and attention the subject deserves."

"We call this the appetite. You can think of the appetite as a time budget for a standard team size."

### Fixed time, variable scope

"An appetite is completely different from an estimate. Estimates start with a design and end with a number. Appetites start with a number and end with a design. We use the appetite as a creative constraint on the design process."

"This principle, called 'fixed time, variable scope,' is key to successfully defining and shipping projects."

### "Good" is relative

"There's no absolute definition of 'the best' solution. The best is relative to your constraints. Without a time limit, there's always a better version. The ultimate meal might be a ten course dinner. But when you're hungry and in a hurry, a hot dog is perfect."

### Responding to raw ideas

"Our default response to any idea that comes up should be: 'Interesting. Maybe some day.' In other words, a very soft 'no' that leaves all our options open."

"It's too early to say 'yes' or 'no' on first contact. Even if we're excited about it, we shouldn't make a commitment that we don't yet understand."

"It's important to keep a cool manner and a bit of a poker face. We don't want to shut down an idea that we don't understand. New information might come in tomorrow that makes us see it differently."

### Narrow down the problem

"We once had a customer ask us for more complex permission rules. It could easily have taken six weeks to build the change she wanted. Instead of taking the request at face value, we dug deeper. It turned out that someone had archived a file without knowing the file would disappear for everyone else using the system. Instead of creating a rule to prevent some people from archiving, we realized we could put a warning on the archive action itself... That's a one-day change instead of a six-week project."

"We flip from asking 'What could we build?' to 'What's really going wrong?'"

### Calendar case study: Defining "calendar"

"Instead of asking her why she wants a calendar and what it should look like, we asked her when she wanted a calendar. What was she doing when the thought occurred to ask for it?"

"She told us she worked in an office with a big calendar drawn on a chalkboard wall... She had to drive to the office to look at the wall calendar."

"The insight wasn't 'computerize the calendar' -- that's obvious. What we learned was that 'see free spaces' was the important thing for this use case, not 'do everything a calendar does.'"

"This story, and others like it, gave us a specific baseline to design against."

### Watch out for grab-bags

"When someone proposes something like 'redesign the Files section,' that's a grab-bag, not a project. It's going to be very hard to figure out what it means, where it starts, and where it ends."

"A tell-tale sign of a grab-bag is the '2.0' label."

"We recovered by splitting the project into smaller projects... We set appetites and clear expectations on each project and shipped them successfully."

### Boundaries in place

"When we have all three things -- a raw idea, an appetite, and a narrow problem definition -- we're ready to move to the next step and define the elements of a solution."

---

## Chapter 4: Find the Elements

### Move at the right speed

"Two things enable us to move at the right speed at this stage. First, we need to have the right people -- or nobody -- in the room... Second, we need to avoid the wrong level of detail in the drawings and sketches."

"The questions we're trying to answer are: Where in the current system does the new thing fit? How do you get to it? What are the key components or interactions? Where does it take you?"

### Breadboarding

"A breadboard is an electrical engineering prototype that has all the components and wiring of a real device but no industrial design."

Three elements: "1. Places: things you can navigate to. 2. Affordances: things the user can act on. 3. Connection lines: show how affordances take the user from place to place."

"We use words for everything instead of pictures. The important things are the components we're identifying and their connections."

### Fat marker sketches

"A sketch made with such broad strokes that adding detail is difficult or impossible."

"The reason for calling them out is we too easily skip ahead to the wrong level of fidelity."

### Elements are the output

"This isn't a spec. It's more like the boundaries and rules of a game. It could go in countless different ways once it's time to play."

### Room for designers

"Working at the right 'level of abstraction' not only ensures we move at the right speed, it also leaves this important room for creativity in the later stages."

"By leaving details out, the breadboard and fat marker methods give room to designers in subsequent phases."

---

## Chapter 5: Risks and Rabbit Holes

### Thin-tailed vs fat-tailed risk

"Well-shaped work looks like a thin-tailed probability distribution. There's a slight chance it could take an extra week but, beyond that, the elements of the solution are defined enough and familiar enough that there's no reason it should drag on."

"If there are any rabbit holes in the shaping -- technical unknowns, unsolved design problems, or misunderstood interdependencies -- the project could take multiple times the original appetite to complete."

"We want to remove the unknowns and tricky problems from the project so that our probability is as thin-tailed as possible. That means a project with independent, well-understood parts that assemble together in known ways."

### Look for rabbit holes

"One way to analyze the solution is to walk through a use case in slow motion."

Questions: "Does this require new technical work we've never done before? Are we making assumptions about how the parts fit together? Are we assuming a design solution exists that we couldn't come up with ourselves? Is there a hard decision we should settle in advance?"

### Case study: Patching a hole

"As shapers, we're thinking less about the ultimate design and more about basic quality and risk. With the compromised concept we get to keep all the elements that made the project worth doing -- the groups of incomplete items -- and we get to cut off a big tail of risk."

### Declare out of bounds

"Since everyone on the team wants to do their best work, they will of course look for all the use cases to cover and consider them necessary."

### Present to technical experts

"Communicate that this is just an idea. It's something you're shaping as a potential bet, not something that's coming down the pipe yet."

"Beware the simple question: 'Is this possible?' In software, everything is possible but nothing is free. We want to find out if it's possible within the appetite we're shaping for."

"Try to keep the clay wet. Rather than writing up a document or creating a slideshow, invite them to a whiteboard and redraw the elements."

---

## Chapter 6: Write the Pitch

### Five ingredients

"1. Problem -- The raw idea, a use case, or something we've seen that motivates us to work on this. 2. Appetite -- How much time we want to spend and how that constrains the solution. 3. Solution -- The core elements we came up with. 4. Rabbit holes -- Details about the solution worth calling out to avoid problems. 5. No-gos -- Anything specifically excluded from the concept."

### Problem

"It's critical to always present both a problem and a solution together."

"Diving straight into 'what to build' -- the solution -- is dangerous. You don't establish any basis for discussing whether this solution is good or bad without a problem."

"The best problem definition consists of a single specific story that shows why the status quo doesn't work. This gives you a baseline to test fitness against."

### Appetite

"Stating the appetite in the pitch prevents unproductive conversations... Anybody can suggest expensive and complicated solutions. It takes work and design insight to get to a simple idea that fits in a small time box."

### Solution

"A problem without a solution is unshaped work. Giving it to a team means pushing research and exploration down to the wrong level, where the skillsets, time limit, and risk profile (thin vs. heavy tailed) are all misaligned."
