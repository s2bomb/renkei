0:02
So per request I'm going to give a talk about how to structure uh large uh
0:08
software projects and um I'm going to talk about like my
0:13
philosophy for how to do design and how I think about like the structure of large things. Um I recently gave a talk
0:20
where I talked about how every any piece of software should be able to be written by one person and a lot of people didn't
0:27
understand or had questions. So it's kind of a followup to that. Um if you
0:32
want to go watch that um go to better software conference their uh channel I
0:38
will link to them and you can see the talk. Um but this is more of a deep dive how to actually build software. So let's
0:45
let's get going. So I'm going to very very brief sort of
0:52
handwavy develop three pieces of software today. And uh I'm going to make a video editor. I'm going to make um a
0:59
digital health health care system because that seems to be something that every government fails at and I'm going
1:06
to build a jet fighter. So, um those are all complicated things and uh just
1:14
before you, you know, start typing that I don't know what I'm talking about, um
1:21
I won't go into every detail. Obviously, these are huge software projects. There's lots of new ends and I'm also
1:27
not really a domain expert in any of these. So, um I'm not actually teaching
1:33
you how to write these specific pieces of software. I'm trying to tell you how I approach various pieces of software.
1:42
So, um any of these projects, you know, you would need a lot of people who are
1:47
have like domain expertise. you would need to have like people have a good idea of the problems that need to be
1:54
solved and and so on so forth. I know a little bit. So I'm going to use this as a stepping off point to u talk about how
2:02
to develop software. But um if you if you want to know details or about any of
2:08
this like I've never developed software for for a jet fighter. So you know um
2:13
don't take all of that with a grain of salt. That's that's not the point here. Okay. Um so this is about process not
2:21
the specifics. Um, so let's talk about the structure. Like how do we structure
2:26
things? That's the main thing. And when we plan a big project like this, we want to optimize for certain things. We want
2:33
to optimize for or I want to optimize for dependability. You want a project that lasts forever and never breaks. You
2:41
want it to be extendable so that you can add new features and capabilities and, you know, things that can change. Um,
2:48
you want to have team scalability and a lot of this comes down to that you want to have very few people or preferably
2:55
one person working on each section of the problem. And therefore, if they are
3:00
insulated from everybody else, you don't have to have like huge team meetings where everybody's working on the same
3:06
thing. You want to create a lot of small projects instead of having one big project. And obviously, you want
3:14
development velocity. You want to be able to get done basically and you don't want, you know, usually with
3:21
software, the the longer you work, the slower things get. And you don't want that. You want, you know, same velocity
3:27
all the time. Um, and a big portion of this is just reducing risk. Like things are going to
3:33
go wrong. That's is just life. But you want to reduce it. So what you got to do
3:38
is you got to think about what your risk profile. What what is most likely going to fail, right? and you want to want to
3:45
really avoid those problems. Um, so here are some of the things that can change, right? Um, platforms can change either
3:52
through API or maybe they change their terms of service or maybe they're not
3:58
hip with the users anymore or things like that. So you want to insulate
4:03
yourself from platforms that change. Um, you have language implementations. If
4:08
you write something in, you know, the hip cool language today, if you're building a system that's going to be
4:14
around for, you know, 20 years or longer, like a jet fighter will be along
4:20
around for 50 years. A healthc care system will probably be around for close
4:25
to that, right? U a lot of the video editors are from the 80s and 90s. So
4:32
having software that can live for decades is really important. And therefore you need to make sure you write it in a language that there will
4:38
be compilers for in the future and things like that. And then obviously changing hardware,
4:44
changing priorities. You may need certain things in the future that you don't need today. And you may lose
4:50
people, right? So what happens if you're a star programmer leaves the the thing?
4:57
Um these are things you really want to worry about, right?
5:02
So a lot of small chances of failures equals a big chance of failure, right?
5:08
Um a lot of little things that might be easy to fix, um if you have enough of them and they happen frequently enough,
5:16
uh things grow really really tiresome, right? So you even if things you know a
5:22
lot of people say, well that's an trivial fix, you know, a compile error somewhere that you can just like fix.
5:29
That might be true, but if you're working on something and all of a sudden your software stopped working because
5:34
somebody else added a little problem, you have to context switch and stop working on that and fix this other thing
5:41
and you know it grinds to halt. You have to look at code you don't understand and things like that. So you really really want to avoid like even the small speed
5:49
bumps because as projects grow you get more and more of those speed bumps and you get more and more you know problems.
5:56
So I'm a C programmer. I use C89. It is the most dependable language you can
6:03
have. Um it will compile everywhere. It will last forever. It you know works
6:08
works works works. Um I am currently actually trying to document what I call
6:14
dependable C which is like the subsection of C that you can depend on and it's mostly C89 if you want to be
6:21
really safe but there's some parts of C99 that are pretty safe to use as well. Um but really these rules
6:29
it doesn't matter if what language you use like you can you can apply all the other things like if you're um you could
6:36
use C++ you could use Python you could use anything really to to write this. This is not a language specific thing.
6:43
Um however I do think like language is one of those risks like Python just
6:48
broke everything when they went from two to three. like if you have a you know millions of code that are in Python 3
6:55
and they decide to make Python 4 and break the backwards compatibility you have a major problem on your hands.
7:02
So So yeah, this is kind of the rule. It's like it's faster to write five lines of code today um than to write one
7:11
line today and then have to edit it in the future. You really want to finish your code. You want to write code so that it never breaks, right? And if that
7:18
means typing a little more, being a little bit, you know, more explicit about what you want, that's a good
7:23
thing, right? Because you're thinking about it now when you're writing it. And going back, you know, five years from
7:30
now trying to figure out what it does and fixing it, even if it's a trivial fix is really, really hard, right? And
7:36
it stops working. You want things that are really dependable. you you leave code when it's done when you know you're
7:44
not going to have to go fix it in a couple years and that's that's really really key. Um so you want to modularize
7:52
your software, right? If you're going to have multiple people working, you want to modularize. So how do we do that? So
7:58
in my opinion modules should be pretty much black boxes. What they do should be
8:03
exposed through APIs or protocols. So you talk to it and it has an interface
8:11
that you can document that is clear and you understand and then whenever you
8:17
want to use it, you talk to that. But you don't actually have to know what's behind the scenes, right? Somebody wrote
8:23
it. It's rock solid. It just works. You don't have to know what it does. You never have to look at the code. You
8:28
don't have to integrate with anything outside of the API. The API is
8:34
documented. Um, and this is why I like header files in Z because you can have
8:39
huge amount of code and then hide it behind one header file says here's all the functions you're allowed to use.
8:45
Here's how you access all the functionality. How I implemented that you don't have to care about because I
8:50
solved it for you, right? Um, so this means you can have one module can be one
8:57
person, right? And that's really key is like you can um you can really split
9:04
everything into small modules and each each module can be one person right and
9:09
you have multiple modules and that's what I mean every piece of software should be able to be written by one person and by that means it's like you
9:16
split it down to modules and the modules are small enough that one person can write it and at some point somebody is
9:22
going to sort of write the application and they do that by taking a bunch of existing modules modules that other
9:29
people are written and just merging them and using all the those things to to do the thing, right? And that's why you can
9:35
have essentially a single person writing all of these pieces of software that
9:40
we're going to discuss today. Um, so yes, obviously you can have good
9:46
programmers that can finish a module and then make the next module. That's fine, too. Um, but the rule is that you should
9:52
really avoid having multiple people have to work on a single module. You may have lots of people working on designing a
10:00
module or like deciding how the API should work, but I really think it's good to have only one person
10:05
implementing it. Um, so yeah, some modules are going to be senior and some are going to be
10:11
junior. There's going to be modules that are hard to implement and there's going to be easy stuff. So you want to really
10:17
think about that and give the hard modules to your senior people and you know the easy stuff to your junior
10:23
people. And this is a really interesting thing. What if what if that module breaks or is
10:29
terrible in some way? Well, if you have an API for it and that API is good, you
10:36
can actually reimplement that API in a new blackbox that uses, you know,
10:42
different algorithms, different everything and all the software is using that will still work, right? And that
10:49
means that if you have a piece of software that is owned by a certain person, you can actually if that person
10:56
leaves, you can write rewrite that from scratch and then gradually move to the next version. And um and that's really
11:03
really powerful. Um so let's talk about the video editor. We're going to talk about you know a
11:09
basic video editor. So uh it's a native application with a UI. So let's start
11:16
there, right? So, you're going to want a stack that looks something like this.
11:21
You want a platform layer. You want to open a window and do things like that. You want to be able to draw, you know,
11:28
lines and things. And then you want to be able to do text. Um, text could be in the drawing library. Um, and then you
11:35
want some UI things so that you can do a UI for your application. And the text
11:40
can also be in the UI. It happens to be in in my UI library. So um you really should wrap your
11:48
platform layer and the idea here is that anything that you don't own which would
11:54
be the platform you should not talk to directly you should make a wrapper around that and there are a bunch of
12:01
rappers out there so for instance SDL is a wrapper you could use however even if
12:07
you use something that is online and and you know open source and you know generally really good you still don't
12:13
control that, right? You don't know the direction of their development. You don't know, you know, if you're going to
12:20
need something else, if you um need to add functionality, you don't know if they're going to accept your patches.
12:26
So, even though you're using, you know, something really good, um you really
12:32
want to wrap it so you don't actually have a bunch of calls directly to code
12:37
you don't have in your code. So, um I can show you this. This is betray.h, H
12:43
which is the header file for my wrapper. Um and it contains all kinds of things
12:49
but it allows you to you know open a window you know just get input lots of
12:55
things. Um and this was actually implemented over SDL from the beginning
13:01
but SDL didn't have this was SDL 1.0 so it was a long time ago but it didn't have all the features I wanted. So I
13:09
made another backend that was win32 and then we've got lots of other you know
13:14
operating systems. Um but this really gives you the control over over the
13:19
platform. Um and um then you want to definitely write
13:25
uh a demo application uh test application. So I happen to have mine here. So this is my little test
13:33
application and this um is a minimal application that just opens a window,
13:38
reads mouse pointers, draws something. There's like some buttons here that do things. I can click here. I have a
13:45
little window here. If I, you know, scroll my window, I get all the events. So this is like really really useful
13:51
when you try to port this API to another platform because if you're building a huge video editor with lots of you know
13:59
millions of lines of code you don't want to have to port all of that code over to the platform. You want to start with
14:04
something very very small and very simple. So therefore it's super useful to do this. Usually you write this while
14:11
you write the platform later because you need something just to test that what you're doing is correct. Um so this is a
14:18
great little thing. So I can uh show you you know uh hold on here is a screenshot
14:26
of the same software running on Android and it's run on lots of other things and this is like when you pl you move to a
14:33
new platform this would be the first thing you do is it's just um get that going and here is you know the file so
14:42
it's it's not huge but it draws some stuff it, you know, it basically tries
14:50
to exercise all of the API. Now, normally when you actually implement this, you tend to um comment out most
14:58
things. So, you you start with just like open a window and then when you get that working, you're like, okay, now I'm
15:04
going to comment out like read the mouse pointer and you you know, as you work through, eventually this whole
15:11
application will run on the new platform.
15:16
So there are things to consider when you do a platform layer and what those are
15:21
depends on your plat your application what you want to do but like what kind of inputs do you want uh you know screen
15:28
resolutions um aspect ratios um scale um
15:34
do you want cut and paste do you want file requesters safe spaces is getting
15:39
more and more important meaning basically you know your window may be this big but maybe you're on a phone and
15:45
there's a notch in the way or something like that or rounded corner. So, you shouldn't really put text there. So, you
15:51
need to be able to detect um which areas of the screen are actually safe for UI or for for information. And then you
15:58
might want to support things like multi-user. So, my uh layer um has not
16:05
just input from multiple input devices but also from multiple users. So for
16:11
instance, you can have two controllers and therefore um those are two different users giving input. Um, and therefore my
16:19
proto um my API supports things like having two mice and two keyboards
16:25
connected to a computer. And therefore you can in my UI toolkit you can click one user can click with a mouse pointer
16:32
in a text field and start typing while the other user clicks in another text field and starts typing and the the the
16:39
typing will go to the right window. Now right now there's no platform that actually supports that. So, Windows
16:46
doesn't properly support that and I don't I I I don't know of a platform that supports that. But if there is a
16:53
platform in the future that will support that, all my applications will just work, which is super useful.
17:00
Um, so then you also want to consolidate a lot of functionality, right? You want to take all the disperate things that
17:07
you could have on a platform and make them one thing, right? So, um, you know, in my example, all buttons are the same.
17:15
It doesn't matter if they're on a controller, on a keyboard, or a mouse, doesn't matter. All pointers are the
17:20
same. So mouse pointer is the same thing as a touch. So basically, we have multi-touch, multi-pointer, they're all
17:26
the same. And you just, you know, a touch is basically a mouse pointer that
17:31
doesn't move when you're not clicking and that um only has one button, right?
17:37
And the same goes with axis. So that would be joysticks or pedals or whatever input you have. it gets a little bit
17:44
more complicated. We'll get into that later. So now you want to do a drawing layer. Um you need, you know, basic
17:51
things to draw UI. If you want to do something, want to draw lines, surfaces, images, maybe shaders, maybe geometry,
17:58
it depends on what you're trying to do. Um this is mine. This is Relinquish.
18:04
It's built over OpenGL, but it actually designed so that you can run it over Vulcan or any any backend. And I'm
18:10
hoping to implement that at some point. Um, and then you want to do text. Obviously,
18:17
all applications need text. And here's kind of a an example of how I would implement that. Like you can implement
18:24
the simplest possible text. So, you can take, you know, a font you find online like this one that is like just a bit
18:31
mapap font. You load it in, you make a bunch of, you know, squares and you draw
18:37
this, right? And if you implement this um you can make a simple function that draws text uh
18:46
float there it's supposed to be um you can draw this really really easily right so since you have this way of thinking
18:53
about black boxes now you can actually make a black box that draws text and it can be super simple like like a bit map
19:00
text doesn't do anything complicated but once you have that you can you know
19:05
people can start writing UIs that text and then you can go in and you can have, you know, proper font loading. You can
19:12
have, you know, all kinds of good stuff, right? So, you can do true type fonts
19:17
or, you know, anti-aliasing and kerning and all that stuff that you don't care about, right? So, this is a really
19:24
important thing. It's like you can you can give somebody an API uh for something that isn't actually finished.
19:30
Like it it draws text, but it doesn't draw nice text. But that's fine because other people don't need nice text in
19:36
order to be able to start building interfaces. They just need text, right?
19:41
So this API that I'm showing here is actually not very good because this one
19:47
doesn't get you all the things you want to do. So I'm going to show you this is my function for drawing text. It's
19:53
actually one out of many. So for instance you want to give it what font you want to give it you know the
19:59
size of the letter the spacing of the letter you know the text and you want you don't want the text to be asy you
20:05
want it to be UTF8 or something like that um you want a color and you want a
20:11
length specifier so you can limit how long of the if so you can uh just print a part of the text now and then you want
20:18
it to return how long the text is right so even if you implemented it using this
20:24
uh this stupid font font with no kerning and nothing. You can still build this interface for it, right? Maybe the font
20:31
is, you know, just null for now. And that gives you the default font. And there is no, maybe there's only one
20:38
font. Maybe you can't choose fonts, but you still have a font parameter there. And that means that people start writing
20:44
this can start writing code as if it was done. And then when it gets done the
20:49
text will start looking great but will actually you know nobody has to reimplement all the places where they
20:57
wrote uh use the text functionality. So this is really you you want to learn how
21:03
to think forward right you want to think what are we going to need in the future right and really avoid implementing ah
21:10
is good enough for now um because you want to finish stuff um and if you have
21:16
to um you know you know text for instance you may not want to do Arabic
21:22
which is backwards and things like that or Korean or things like that right maybe your product team can't wait uh
21:30
for for you to implement that because they need to ship something, right? So then you can implement something simple,
21:37
but you never implement a a good enough for now API. The API is the same. You
21:42
know, you think through I'm going to do Korean at some point. So let's make an API that is is good enough for Korean
21:48
and then people can use that and even if you can't draw Korean now, it will in the future and they won't have to change
21:55
their code. So that's really really important. Uh and then you can you know do the same
22:00
thing build a UI toolkit. I have a UI toolkit. This can be modularized. Mine
22:05
is one big UI toolkit but you can modularize it for button and things like that. And I would argue that making a UI
22:14
toolkit is relatively easy. Like buttons are easy to implement, sliders are easy
22:19
to implement. The only thing that is kind of tricky to do in UI is is text input. So, um, not relying on the
22:27
operating system, not relying on a platform is is not a big deal. And especially if you're making a portable
22:33
thing, a portable application. And if you have to figure out how like three different platforms do a slider, you're
22:40
going to need more time to do that than to implement your own slider. So, just make a slider.
22:46
Um, so, okay. So, now we have this, which is like our our base layer. Now,
22:53
one of the things you might notice is that like um you can actually none of
22:59
this has to do with the the video editor, right? This is just like stuff
23:04
you can build anything with like any desktop or or mobile app. You can just write it, right? So, once you've done
23:11
this, this is actually a superpower for for yourself, for your company. And to me, it's like amazing that like large
23:18
billion dollar software companies don't own this. like they should just have this so that they quickly can make
23:25
whatever product they want to make in the future. Like you should not have to rely on the operating system to to draw
23:31
text. You know, if you're, you know, even if you're a small company, you should be able to do this. If you're a
23:36
huge company or a big company, you should definitely have this as as part of your tool toolkit.
23:44
Um, so yeah, these are all sort of helper libraries, right? And um you really want to put as much as you can in
23:51
helper libraries because helper libraries can be reused for any project, right? So fell parsing, physics engines,
23:58
uh scripting, data storage, networking, all kinds of stuff like that, right? So for instance, for networking, you know,
24:05
I have Testify, which is a library that does all of the the things you need to
24:11
do and it can figure out what kind of network you're on. It can do, you know,
24:16
all kinds of stuff. It opens up ports with port forwarding protocols. It it
24:22
can find peers. It can do all kinds of stuff. And um it's really really
24:28
powerful. And um it basically means that I never have to care about like the
24:34
socket API ever again, right? And I can improve this under the hood. So there's
24:39
capabilities of of like how to connect and how to you know u do certain things
24:44
that I can improve under the hood without changing any of the applications that use it.
24:50
Okay. So now we're getting to the core which is when you're actually starting to build the application you're building
24:56
and this is kind of the majority of this talk and how to how to build a core.
25:01
Um so what are the things we are editing? What what is the thing that this application does? How can we
25:07
generalize what it does, right? So, um, in my opinion, a video editor is not
25:14
something that edits video. It edits a timeline, right? It's a timeline, a
25:20
bunch of clips that overlay each other and they're in time and you can from
25:26
that you can generate a video. You have a bunch of clips, you have an input data and then you have a rearrangement of
25:32
that input data and then you get an output. Right? So, we can think about this as as you know, clips on a timeline
25:39
with animated parameters, right? Because we're going to need parameters. We want to zoom in. We want to color correct. We
25:44
want to do titling. We want to do all kinds of things. So, those are going to be parameters that these clips have.
25:52
So, everything is a clip, right? Now, we've made it really generalized, right?
25:57
And this is really key. It's like if you can generalize things, you can make really nice software. So Unix everything
26:05
is a file right and that means that you know lots of stuff in Unix are
26:10
compatible because it's like this takes a file this outputs a file you can connect those together and things work
26:17
right um software like uh Houdini uh I think I have a screenshot here is
26:22
basically a node graph the whole software it's a big visual effects package is basically one big node graphs
26:30
where each node has parameters on it that that's what Houdini is right and uh
26:35
notch I I just want to bring up because they're awesome is the same thing. It's it's a node graph to do visual effects.
26:42
Right? So these are you know basic structures that you can put your whole
26:48
application into. Right? If you take something like Unreal, it gets more
26:53
complicated. Right? Unreal is C++. It's a bunch of C++ but there's also
26:58
blueprints and there's also scene graph with assets. That means that you can't generalize everything quite as easy and
27:05
you end up with situation where like oh we've done this in Bluetooth uh in sort of blueprints sorry uh but we wanted it
27:12
to be in in C++ or we did this in C++ but now we can't access it the way we
27:18
want it in blueprints or is this is an asset is it blueprints what is data what
27:23
is it gets a little bit more complicated and this is not directly to critique Unreal Unreal does very very complicated
27:31
things. So sometimes you can't simplify things like this, right? Um the world
27:36
isn't as simple as you want it to be, right? Um so what you want to think about and
27:43
what I think a lot about is something I call primitives. And primitives is sort of a word I borrow from computer
27:48
graphics. Um I have a computer graphics background. So I think I think in polygons or or or things like that and
27:56
we want to talk about polygons, right? So if you want to make geometry, you can
28:01
define them by polygons, right? So typical, here's a Utah teapot. It's a bunch of polygons like little triangles
28:06
or quads. And that's a very simple way to express 3D data. But you can also
28:12
think about other ways of doing it. You can do nerves. They are mathematical curves. Um they can actually do, you
28:19
know, curves. Uh polygons can't do curves. So if you want to do a car modeler, you nerves are way better. Uh
28:26
but nerbs are really really complicated mathematically and they're not easy to deal with and and you need a lot of code
28:33
to manage them. Um you can also do something like this like this is tear
28:39
down. So tear down everything is built out of voxels little cubes if you will
28:44
even though they're not. Um and that means that it's super easy to do collision detection. It's easy to do
28:49
destruction. It's easy to do a whole bunch of things that are super hard to do with triangles. Um, on the other
28:57
hand, there things like making a smooth surface with a bunch of little cubes is
29:02
pretty much impossible, right? So, you win some and you lose some basically.
29:08
And then, you know, we can go further. This is, you know, sign distance fields which are, you know, a new hot way of of
29:15
doing mathematical shapes. um that gives you a bunch of other advantages um and
29:20
disadvantages or you know my favorite is subduction surfaces. This is from my subdution surface modeler which gives
29:27
you a poly mesh that gets rounded into a a smooth surface or a smoothish surface.
29:35
But which one of these you choose really makes you choose what kind of software
29:42
you're building. And some of the more advanced softwares like you know Maya and and others they allow you to have
29:49
multiple different representations of geometry. But that also means you get a lot of complexity in your software
29:55
because now there's functionality you can do on nerbs you can't do on polygons or things you can do on on your voxels
30:02
but you can't do on your polygons. So you have to convert back and forth and you get lost and it be getcomes really
30:09
complicated. So if you can find a primitive to store your data um that is consistent and that works for everything
30:16
that's really really neat, right? So um Unix uh let's talk about Unix some
30:25
more. Like Unix is a good example actually of this. So Unix everything is files, right? Pretty much text files.
30:32
They're not any file. And that means you can grap it for a piece of text and you can find it and that's great. But it
30:39
doesn't work for like you can't GP for a quote from you know a MP4
30:45
file that contains Casablanca. You can't find all the good quotes because GP works on text not on video right. So by
30:53
limiting yourself and saying everything is a text file, you can do a lot of things with text files, but when you
30:59
want to do video editing or image editing or something that isn't text, you know, Unix and the command line is
31:06
not really a good interface. And there here's I want to talk about um
31:11
primitives versus structure, right? So in Unix you could say that the structure
31:16
how we use um this is we use command lines with pipes to pipe things between
31:22
applications right but the thing that moves between the application the format
31:27
of the data that goes from A to B that is files and that's the primitive right
31:32
and if we change the primitive we could make a command line system that where you can pipe video from A to B and then
31:38
the primitive would be video but we'd still have the same structure right or we can also have a structure where we
31:44
have you know a UI as a node graph but where through the cables we push text
31:50
right so we use the same primitive so these are two different things you have to think about like when you choose how
31:56
to design this right and here's an example so Photoshop has the structure
32:02
of a bunch of layers which isn't really true in modern um Photoshop because Photoshop is complicated but we can
32:08
think of it as a bunch of layers of bit maps right whereas Nuke which is a compositing software. Uh I have a
32:15
screenshot here. This is a node graph um from Nuke that allows you to composite,
32:21
you know, video essentially. Um the primitive is still bit maps. There's still bit maps moving through this
32:27
thing. Um but it's a tree structure now. So again, you know, both of these, you
32:33
know, they're not really always bit maps. They're, you know, they can do curves and things like that, but sort of generally you can think about these as
32:40
two different things. Um so in our case when we want to do a a video editor we
32:46
say that all tools that we want to make operate on clips right when you move in
32:51
your timeline you're basically editing a clip or you're changing parameters of that clip that's all you do all the UI
32:58
everything does that that's what the application actually is so we want to
33:04
build a black box that stores this information right stores a timeline and have an API so we can access it Right.
33:12
So, uh, an example of something that actually exists that does that is open timeline io, which is an open, um, API,
33:19
Python API to create a timeline. Um, you would probably build your own.
33:25
Um, so when you build this core that keeps
33:31
all your data from your application, you can enforce these kind of guarantees. So, in our case, we kind of want to do
33:38
certain things. For instance, we want, you know, clips not to have negative time or, you know, maybe we want clips
33:45
to never be longer than the asset they are using. Maybe we want, you know,
33:51
consistency in time. Maybe we want whatever we think is important and that we want to guarantee. And that means
33:57
that when APIs call this, they don't have to care about that, right? They know that the data they are going to is
34:02
going to have, you know, certain requirements and and be clean, if you will. Another thing you might want to do
34:09
is undo, right? Other application can just say change the clip like this and
34:14
automatically this you know storage container of will actually manage
34:20
figuring out what the changes are from the last version and be able to undo those. Um so therefore you want to build
34:26
that into your core structure. Okay. So what kind of clips do we want to support? Like we want to load all
34:33
kinds of video, right? So, how do we do that? Well, if the core has a definition
34:40
of every clip you could ever want, every video format, every effect, everything,
34:45
then the core is huge and it's not possible for one person to write it. So, we really, really don't want to do that.
34:52
So, we want to build a plug-in architecture. We want to build an API where, you know, a piece of code can go
34:58
in and say, I can do this. I can show you video of MP4 and I will give you
35:05
this information about the length and resolution and things like that and I will need you know the speed you want it
35:12
to be played back at and the default of that is you know 1x and you know you
35:17
want to describe this plugin basically um and this plugin so you basically get
35:24
something like this this is my structure for this so you have a core with a bunch
35:30
of plugins and And then we have our UI toolkit. The core here um doesn't
35:36
actually have a UI, doesn't do anything. It's it's just a core, right? That you can, you know, read in plugins and then
35:42
you can access the plugins. So let's have a look at what you want to write next. Well, you want to write a
35:48
launcher, right? You want to write something that you know starts up the platform, starts up the core, loads in
35:55
all the plugins, and actually does something. So, uh, in my case, uh, let's
36:02
see. I think I'm missing something here. Um, I'm going to show you some demos of this in a second. Um,
36:10
in my case, you, this might be enough, right? You might just have all the UI
36:15
and all the APIs here. You just write a UI for, right? If that's a simple application.
36:21
Um, and I'm going to show you a simple application. So uh let me show you an
36:27
application I have written that works kind of like this. So this is stellar. Um it's actually stellar 2.0 which is an
36:34
application to control u lights and
36:40
you can I I'll show you a little bit about how this works. So here is a 3D
36:46
world and here u we have a light fixture. So now I looked on the network
36:52
and has to be a light fixture there. I can create a collection of light fixtures which gives me inputs and then
36:59
I have a bunch of these which are things that do things and these are plugins. So all the effects in this application are
37:06
plugins. So I can for instance create a sphere and I can connect this to this.
37:13
So now you can see I have a sphere here and um I can actually move this sphere.
37:21
I can change parameters. I can make it a little fade. I can change the color um
37:28
or whatever I want. And then this application happens to be a node graph as you can see. Um I can bring in other
37:35
things like I can create some motion here. connect this to motion and then uh
37:42
run it on a loop. So now it
37:48
it moves very fast, right? So now I've created a a simple effect, right? And I
37:54
can bring in some other things like I can bring in
37:59
color ramp. So I'm going to take this ramp.
38:06
Sorry. And I'm just going to make it slightly smaller.
38:13
So I'm going to connect this to the ramp instead. So now it gets a single color. And then we're going to drive this ramp
38:20
with this thing. And now I can say a color here and another color here. And
38:27
let's let's make it black here. Right? So now I can remap and do all kinds of
38:32
stuff. So um this is kind of what this application does. Um but if we if we
38:39
look under the hood, you can see that actually all of these are plugins. Even this is a plugin. It's a built-in plugin
38:46
um that just sort of magic plugin that talks to like fixtures. And then these
38:51
are all just describing what they do. So if we look at the internals of this um
38:58
this API is what you build your UI from. You basically say here's to create an
39:05
effect and you know you can create nodes. You say which node you want. Um
39:10
you can get all of the you get the descriptor that tells you what parameters it has and then you can set
39:16
those and you can build basically a UI. So this this little thing is all you
39:23
need to really build the whole UI, right? So the core can be kind of small and then you on top of that build a UI
39:30
and that means I can rebuild the UI without ever rebuilding the core. And one of the things about this application
39:36
which you might want to do with a video editor is you can actually take your core and make a separate application. So
39:42
let's say you have you know your video editor and then you save a video editing file. Maybe you want to have a, you
39:49
know, a command line tool that can just take that and process the video for it because you want to run that on a server
39:54
or something like that. Well, then you can have the core and then you skip all the UI, all opening window and just make
40:00
a little command line thing and all of the core of the application that does all the processing is completely
40:06
separated from the UI. Um, and we can actually I will show you
40:12
a plugin. So here is um a file that is a bunch of plugins and what you do to
40:19
create a plug-in is you these live in a separate DL and that means that um the
40:24
application stays kind of small and you can have people writing DLLs and you can add those one by one and those people
40:31
can basically work completely isolated. They don't have to know the people who write the co core. They can just follow
40:37
an API and and make any plug-in they want. And most of the interface, most of
40:43
the the functionality in the application sits inside of those plugins. So here's kind of a simple way you say, "Hey, I
40:50
want to do a sphere," which was the effect we saw. It's it will output color. It's part of a shape. You know,
40:57
some text you can put in UI that describe what it does. And then you list all of the inputs of it, what what
41:03
they're called, what the default values are, you know, a little bit of UI hints of how you might want to draw this. And
41:10
then you also give it a function. And if we go to that function, this is the
41:15
function that actually does the the computation, right? So this allows you to implement new features really really
41:23
quickly. So, um, and actually just to be really
41:29
nerdy about it, um, this API, this kind of plug-in API, I also have that for for
41:35
for Betray, which is my platform library. So, if we look here, this is
41:41
the platform. This is a plug-in for for doing uh controllers on on Xbox
41:46
controller, basically Windows controllers. So that means that when I build my system, I don't have to link in
41:54
special code for for Windows. That's a separate plugin that can be built separately. And therefore, you know, I
42:01
don't have a dependency on that. Um I only have a small DL that has a dependency and the system will work just
42:08
fine without it. It's just sort of an optional thing. And that means that it's you can have a lot of little
42:14
dependencies, but you don't ever need all of them to build it. you need no almost no dependencies to build the the
42:20
the project but then you can add the the the stuff you want. Okay, let's move on.
42:27
Um so um you want to present um information and
42:35
capabilities and this is kind of a pattern that comes up almost always to me. And when you build structures for
42:43
things, you want to be able to have things say what they can do and what they um what they can tell you, right?
42:51
So here's like a very simple washing machine, right? If you look at these two strcts, what am I doing? You can think
42:57
of type defaf. It's like I am a washing machine. I'm currently running, you know, and you have an enum for what kind
43:04
of mode you're in. What's my current temperature? What's my current load? And how many seconds do I have left? Right?
43:10
If you if you get this information with the information of the structure like if
43:15
a if a washing machine can say these are the parameters I can tell you about
43:21
myself that's all you need to build a UI right you could build an app that works with this right and then the same thing
43:28
is like you need a struct to say basically here's the parameters you need to send me in order to tell me what to
43:34
do like you know you need to tell me if I should run or not in which mode and in which temperature, right? And I can't
43:42
for the life of me why believe why the um the people who do IoT stuff um can't
43:48
get this right. But really, you want to you don't have to know that it's a washing machine to build this system,
43:54
right? All you need to know is this is the stuff that it wants to tell you. This is the stuff it needs to know,
44:01
right? And whether that's a washing machine or a toaster or a whatever doesn't matter, right? And I'm actually
44:08
working on a project called Marshall, which I hope to make a new video about that will solve a lot of these issues.
44:15
Okay, so here's our new updated design. We might have a core, bunch of plugins,
44:21
but we may also have a launcher UI and then plugins to that, right? So if we
44:26
have a complicated UI, um we may have a launcher that starts it and then says,
44:33
"Okay, there's a bunch of panels here. the panels that show information, they
44:38
are themselves plugins and they talk to the other plugins and do the graphics and therefore we can split up the UI. So
44:45
we have one engineer doing just a timeline and one doing you know the video view or color correction or like
44:52
all the different sections we we may split those up and not have one code base, right?
44:58
Okay. So let's build a health care system and you're going to see that it's very very similar. Um so first obviously
45:06
you want to figure out your requirements. uh you want to figure out what's the primitive what is the data
45:11
that flows through you know health care system and uh maybe medical journals
45:16
right that's what people think well probably not the greatest things I think we should probably have healthc care
45:23
events right because if you think about it your health care journal is a bunch
45:29
of events like starting with you being born and a bunch of things happen every time you go to a doctor that's an event
45:35
right and what's neat about that is you can then also have future events like your appointments and you can also
45:43
access the data in a different way. So you may for instance want to say I want to get all of the health care events at
45:48
this clinic today, right? And that means I want to access everybody who is going
45:54
to be here and when they're going to be here today, but I don't want their full journal, right? I might be a clerk
46:00
somewhere. I'm not allowed to read all the information, but I need to know who's going to be here. I need to know
46:06
when there is a, you know, gap in the schedule, and I need to know that, right? So let's go with that. Let's say
46:13
we're doing a bunch of events, right? And then we do exactly the same thing as
46:18
we've done before. We build a blackbox and you know, here's what people start
46:24
out with. They say, "Well, you know, what kind of storage would you choose? Would you do SQL or blah blah blah or
46:30
Amazon or whatever?" And that to me is completely the wrong way to go about it. What you want to do is what are we
46:36
storing and how are we accessing, right? And that is a blackbox how it's actually
46:42
stored, right? So I would probably store it at some kind of open-source
46:48
thing that I would find good. You can write your own or whatever, but to all
46:53
the users of the system, none of that matters, right? And that means you can actually change your storage anytime you
47:00
want. You can rewrite it and go somewhere else, right? You don't want to lock yourself to, you know, Amazon or a
47:06
certain vendor. You don't want to even lock yourself to, you know, MySQL or something that is stable and open
47:12
source. Who knows what you're going to want to use in the future, right? So, you really, you know, for the users of
47:18
the system, they shouldn't have to know, they shouldn't have to like do SQL calls
47:24
because there might not be SQL behind it, right? You need to make your own interface for how to access this thing.
47:31
And that means you're way more flexible. Okay. So the second thing you can do
47:36
once you built this is once you have an a API between your black box you can
47:42
take whatever old system because guess what your health care system probably has something anient that you want to
47:47
get rid of but you don't want to switch over right that's what a lot of projects like this they fail because they switch
47:54
over right and the switch is really really painful so why do that so what you do is you write a little piece of
48:00
glue code that uses your access API with the old access API Okay. And just moves
48:05
all the data between it. So when you get a new event or new data into your
48:11
system, you move it into the old system, when the old system gets something new, you read that out, put in the new
48:16
system, right? So now nothing will break. Now you can gradually move over, right? And this is super useful that you
48:23
don't want to have this breaking change where you say we go from system A to system B. No, no, you want to have both
48:29
system at the same time, right? And then you can start doing other glue
48:34
codes on top of this, right? So let's say you have this black box. Maybe you want to have multiple APIs to use it,
48:42
right? Maybe you want a C API, but hey, nobody's going to write C, right? Maybe the hardcore people want to write a high
48:48
performance C thing, but you know, most developers not going to use C. So you can make a C++ API on top of it. You can
48:55
make a Python binding. You can make all kinds of bindings on top of S. and they
49:00
just use the same API. And then you can get, you know, your hardcore C++ nerd to write the perfect C++ thing. Actually,
49:07
there is no perfect C++, but whatever, right? You can have different people writing these glue codes that that gives
49:14
people multiple ways of accessing the system u without needing, you know, to
49:20
basically use the the core APIs. And then of course when there's new languages, new capabilities or new ways
49:27
people want to access, you can write new GL glue codes, right? And then you can
49:32
write stuff on top of that. So on top of your glue, you can say, well, now we take data out of the blackbox and you
49:39
know, we send it over the internet and now we can write a app that does something very specific, right? So we
49:46
can have hundreds of different apps for different kinds of health care people for machines that you know do things
49:53
with healthcare and they can all report back through the internet and they can use their own way of of talking just as
49:59
long as it ends up in in one of these sockets right and now we can build a website right so we you know let's say
50:06
we use Python so we can take you know a Python API and we can generate a website
50:12
and you can use a browser to access the information Right? So you can sort of fan this out and grow a tree of stuff,
50:18
but everything goes through this central black box of thing, right? Um now in
50:25
reality that blackbox might run on one machine or a thousand machines or you know but to the users to these
50:33
applications it's just an API you talk to and you don't have to know what happens in the background if there's a
50:39
big server infrastructure to store all this data. you know, how it's sliced and
50:45
dice. None of none of that you have to care about because this is an API to you.
50:50
Um, so let's build a jet fighter. Okay. And that you're going to see that it's pretty much the same thing. Okay. So,
50:58
um, we have lots of things here. We have lots of sensors, weapon systems, like capabilities forever, right? And a lot
51:04
of these capabilities, we don't even know what they are because if you build a jet fighter today, it's going to be
51:09
around for 50 years. So who knows what kind of missile or drone or sensor or
51:14
whatever you want to put on this thing you know 25 30 years from now. So even
51:20
if you can probably survey this and you can probably have some really smart people who can tell you all these things
51:26
even they are not going to be able to know. So you can't really architect a system knowing what it's going to be
51:32
right. Okay. So what is a primitive we might be able to use? So we might say
51:39
well the primitive here is the state of the world like a whereas a health care system cares about history um a jet
51:47
fighter mostly cares about what's going on right now right it wants to know where are all the contacts where are the
51:53
enemies how much fuel do I have how many bullets do I have left you know which radar can detect which object you know
52:01
what's the wind temperature all kinds of things right that all these sensors and
52:06
things are are giving you, right? And you want to care about some things that are specific to, you know, aircraft. So,
52:14
you know, you want to have confidence, right? How how, you know, how much do I trust this thing, right? Um, and you may
52:21
not trust everything in a war, turns out, right? You want accuracy, right? If you have two different things that
52:27
measure the same thing, you want to know the accuracy of those things, right? Um, you want to know what the source is,
52:33
right? So if you get temperature from something, you want to know what the source of that temperature is. Um you
52:39
want to know what the format is, right? So you might have multiple formats of things like maybe I want to know where
52:45
position of this enemy. Do I want it, you know, in relation to the the jet
52:50
fighter or do I want to know where it is in the world? Like those are two different things, two different ways of
52:56
asking where a thing is, right? And then I want a bunch of capabilities. Like I
53:02
want to know if you put on a missile on the plane, you want to know what can this missile do, right? And when you
53:09
fire it, you want that capability to be gone, right? And you want people to be able to add new capabilities, new
53:15
missiles, new things. And then the system should be able to understand that now you have a new capability. And then
53:23
um you probably want to have things like damage like things you know accuracy may
53:28
go to zero if somebody has blown off a sensor or something like that.
53:34
Okay. So you want to build again a core right uh blackbox to store this. So what
53:41
you do is you make an authorative core. You make a core that has like here's the
53:47
world according to all the sensor and all the stuff. This is the current state, right? But then you're going to
53:53
have lots of little computers around, you know, lots of systems, every every little radar, every, you know, the
54:00
displays. There's going to be computers everywhere, right? So all of those need to know the state. So then you need a
54:07
protocol so that they can subscribe to information, right? You probably want to have a subscriber model where you know
54:14
um a certain you know the engine wants to know you know the humidity and it wants to know how much fuel or or you
54:20
know the altitude and things like that but it doesn't need to know like um you
54:25
know how many radar contacts you have. That's not interesting to the engine, right? Doesn't care, right? So you want
54:31
to basically and you're going to have some parts of the the the plane that are going to have really powerful computers
54:38
and some parts going to have like microcontrollers. So you want to be able to subscribe to the information you want. You want that
54:45
to be push notificied to you. You may have different rates how often you want
54:50
information and things like that. And once you have that subscriber, you
54:55
can then on your local chip in your local memory have you know a partial state of the world right and you can
55:02
then use that to um make decisions right and then you can even you know when you
55:09
when you build this system you can say well we might want to have different ways of encoding this information
55:14
between the subscriber and the authorative core because we may have different types of cables different
55:20
types of you know hardware connectors basically, right? We might want to support multiple of those with
55:26
different bandwidth, different requirements, what have you, right? But this still means that if you're
55:32
building a piece of equipment for this, you now have a stable API, an API you can call to know what's going on and to
55:40
send information. So if you're building a radar, you can, you know, get the humidity or whatever you need from the
55:47
system and then you can send all the contacts you find to the authorative core and the authorative core can send
55:53
that on to, you know, the pilot or the visualization system or the screens or
55:58
the head-up display or whatever system is interested in that information. Okay, so it's not really a storage
56:06
system here. Like here's a pass through system, right? you're passing data from one end of the plane to the other. Um,
56:12
and you can obviously store as well if you if if that's a requirement. Um, and
56:17
here is a really important thing um that goes for all of these project and that's if you build something like this, you
56:23
want to do a lot of tooling, right? So, let's say we're building a new jet fighter. Um, we haven't figured out what
56:29
it's going to look like, but we build this core, right? and we're going to have all these different contractors and
56:34
people building missiles and things and they all have to somehow connect to this thing. How do we do that? Right? They
56:41
can't like how do you how do you test a missile when the button in the uh that the pilot is going to press isn't done
56:47
yet, right? So therefore, you want to have lots of toolings, right? So you want to be able to take all the input
56:53
from various things and record it, right? So now you have a blackbox recorder, right? Because all the information goes through this thing. So
56:59
you can have a little recorder that subscribes to all the information and stores that, right? Great. And then you
57:05
can have a playback. So now if you have, you know, your first flight, you can record information and then you can put
57:11
that to a missile and say behave. Here's a real flight that we recorded. Here's all the data from it. Now we can
57:18
simulate that, right? You may want a Python API because maybe you want to, you know, when you test a certain thing,
57:24
you want to simulate that, you know, um, something happens like what happens if
57:29
this goes away or the radar stops working or whatever. Now, you can simulate things like you want a logger
57:34
so you can see what's going on. Maybe I'm just implementing my radar and I need to be able to see when the radar
57:40
outputs that it outputs correctly, that the the data coming into the system is correctly. Just having something that
57:46
can print it on screen is like super useful. Um, you can have visualizer to
57:51
see what's going on. You can have full simulators, right? And all this code that I'm showing on on the slide are
57:57
stuff that never actually going to go into the jet fighter, but they're going to be really, really helpful because it
58:03
allows all these separate people who are trying to write to this code to be able to get the code to do what they want so
58:10
they can test their code, right? And that's going to help them once you actually start putting the plane
58:15
together and all these pieces talk to each other. You know, if you can have a
58:20
missile and you can simulate what the cockpit does and then you can record
58:26
what the missile does, you can send that recording to the people who make the um the cockpit and they can say, "Okay,
58:32
this is what we're expecting to get from the the missile when when the missile is firing or when the missile is finding a
58:38
lock or whatever the missile does, right? And and this would go for almost all the
58:44
projects I've talked about, like almost like always write a bunch of tools that
58:49
that you can get your data out of your black boxes and and or your core boxes and and make them do things. Um at this
58:57
point, um this black box doesn't actually know anything about aircraft,
59:03
right? It does it can't actually do anything. It doesn't do, you know, avionics. It doesn't do target tracking.
59:09
It doesn't do it doesn't visualize anything. It it doesn't it doesn't do anything. It just passes data through it, right? And we're not actually giving
59:17
away anything secret here, right? So, this could actually be open source, right? You could give this away to anybody, right? You could put it on a
59:24
website and says this, you know, we're not going to tell you how far our missile goes, but here's how our missile
59:31
tells the system how far it can go, right? And that means you can have all these contractors that can have these
59:36
manuals and go out and try to build parts and you can have an open uh
59:42
bidding for making stuff that fits into this plane, right? And and that makes it
59:47
a lot easier to to do things. Um because you you've removed all the secret stuff.
59:53
You're just saying this is how we collaborate. Um but you know um um the
59:59
actual secrets and how it actually works that's up up to the end points and yes yes I know that no real military would
1:00:07
ever make anything you know um open source because they don't understand this kind of things. Um, so yeah, now
1:00:15
people can add all these bits. Now people can add sensors and weapons and UIs and connectors and all kinds of
1:00:20
stuff, right? But then you say, well, this is a crappy system because now we
1:00:25
have everything centralized. It's bad, bad, bad. Like what if, you know, somebody blows off this computer that is
1:00:31
running the core thing now everything is terrible. You know, the plane crashes, nothing works. That's true, right? So
1:00:37
that's a requirement for a jet. Like jets have redundant systems. So you
1:00:42
can't have like one central core where everything goes through, right? That wouldn't work. Well, you could easily
1:00:50
build multiple cores. The the thing here is that you can have any number of cores
1:00:55
that sits on lots of different computers. You can have lots of interconnects between all these systems
1:01:01
that are redundant and over redundant, but the subscribers get their
1:01:06
information through the same API. Right? So that means you can make a single core that's very simple to implement. You can
1:01:13
implement that, give that to everybody. They can get started on their missiles and equipment and all this stuff and
1:01:19
then you can spend three years making this advanced system that has multiple
1:01:24
cores that vote on which is one that can detect which one has been blown up and doesn't work. And you can build all that
1:01:31
and then you present to the same people here's the same API the same way you get the same information. It's a drop in
1:01:36
replacement, right? But instead of waiting three years to get that, everybody could get it, you know, in six
1:01:43
months, right? And that's really, really core to this blackbox thinking. You can
1:01:48
redesign the inner core to be more complicated. And sometimes you do that, you know, because you figure things out
1:01:56
and sometimes you do it because you need to get product out. So this is this is exactly the same thing as we did with
1:02:02
the text rendering. We started with simple text rendering but with the same API and then we made nice text rendering
1:02:09
afterwards but the users of that API didn't need to change anything because it just works right
1:02:16
okay so here's a cool thing you could put this in a tank now right it doesn't have to be in a plane it could be on
1:02:21
anything right if you now that you have connection between things you can connect multiple planes together they
1:02:28
can share this information right so now instead of saying you know I got a radar lock because my radar found this enemy.
1:02:34
You can have my neighbor, the other ship, you know, fighter found it or the ground radar found it or anything found
1:02:41
it. It doesn't matter, right? Because now you have a way to communicate about the state of the world, right? And
1:02:47
you're obviously going to have lots of encryption and lots of things to control what you want to get in and out. But
1:02:52
really, once you have a system like this, you can, you know, make it very generalized. It doesn't have to be in a fighter jet. It could be on transport
1:02:59
jet. It could be, you know, on a tank. It could be on anything. And that means that now the people who make missiles,
1:03:06
they may want to make a missile that can be launched from a tank and be launched from a plane and they have the same
1:03:12
interconnect, right? they don't have to write two software stacks to control these two different things in two
1:03:17
different um things and things become a lot more interconnected and even if
1:03:22
there's going to be lots of differences you can actually have the same knowhow and people will know people can move
1:03:29
from different you know different projects and they know oh when I talk to the system this is the API this is how
1:03:34
you talk even though the thing I'm doing now is completely different hardware-wise or capability wise from
1:03:40
the last thing I was Okay, so let's wrap up. Um I've talked
1:03:45
for a long time. Um so um this is really uh
1:03:53
can I make this smaller? There we go. Um core to all software design in my opinion is format design. And format
1:04:00
design is something that isn't really taught and I wish people would teach it.
1:04:06
Uh, I'm trying to write a really long article in a book about this because it's it's really is what we do as
1:04:14
software developers and a lot of things are formats if you think about it. An API is a format. It's a format for
1:04:21
sending calls to some code. Files are a format. It's a format of how you store
1:04:27
things in a file. Protocols like network is how do I store information in in a way that's a format. Programming
1:04:34
languages are formats. It's a way you store how you know instructions for a
1:04:39
computer and um it's also you know you write in that instruction language. It's
1:04:45
a format of of what you can and what you cannot do in this way to describe in
1:04:50
instructions. So formats are really important. There are some things you should think about.
1:04:56
One is the difference between uh semantics and structure. Right? So
1:05:01
sometimes um you store semantics only. So for instance uh the metric system is
1:05:07
only semantics. If I tell you 3 m everybody can figure out what 3 meters
1:05:13
is. But I'm not giving you you know how do I structure that? I gave you that through words that came in sound. That's
1:05:21
not defined. You can write it down on a piece of paper. You can you know type it into a computer. Doesn't matter. A meter
1:05:28
is a meter. Right? We we describe what semantically it means but not
1:05:33
structurally how we send it right and reversely you can think of something
1:05:39
like JSON JSON is a format gives you a structure for storing data but doesn't tell you anything what that data means
1:05:46
there has no semantic meaning it's an array of things but it doesn't say what those things are right so you need to
1:05:53
think about these things and what you make semantic and what you make structure a lot of times you want to
1:05:58
have a simple structure and then you can have more complicated semantics because then you can reuse
1:06:05
code that reads uh the semantics right so JSON again a JSON loader can load any
1:06:13
JSON it can store healthcare data or you know weapons data or um or video editing
1:06:20
data doesn't matter right semantics doesn't matter you can use the same loader for all these kinds of things and
1:06:25
that's kind of useful right but it also has its limits because yeah you can load it but you can't really do anything with
1:06:31
it because you don't understand it right you don't know what it means and formats need to be implementable and
1:06:38
this is really really key right it's like if you want all these people to
1:06:43
come together and work if the API or the format is too complex it becomes really
1:06:50
really hard right if I'm going to make a a UI and the data that I'm trying to
1:06:55
make a UI for is super super complex text then I'm going to halfass it and I make a UI that can only display like
1:07:02
simple stuff right and then you start getting incompatibilities right people
1:07:07
start saying you know oh I I don't support those things and languages are a great example right the larger a
1:07:13
language you have the the fewer implementations you get or the more bugs you get in your implementations or you
1:07:20
know there's more things that you know more people can't read it it gets more and more complicated right smaller
1:07:26
formats are easier to implement and therefore the quality of implementation are generally better, right? So you want
1:07:33
to pack as much power as mo possible into a simple interface, right? A simple
1:07:40
format. And that's the thing is is formats are are two-ended, right? It's like if you
1:07:45
save a file, you have to load a file. If you send a network pack, you have to load a network package. And if you make
1:07:52
a complicated API, u somebody has gonna have to use that complicated API, right?
1:07:58
So it's like a language, right? So the more you make it complicated for your,
1:08:05
you know, other people, you make it more complicated for yourself. And it it sort of squares a lot of times, right? If you
1:08:11
have 10 different people and they each want a feature, you're going to get, you
1:08:18
know, 10 features and now everybody has to implement this. And a very common thing is to say people say you know I
1:08:25
wish this file format um you know let's say we have polygons and nerves and some
1:08:30
people think polygons are good and some people think nerbs are good and they say I wish this was nerbs and not you know
1:08:38
but the problem is if you support both polygons and nerbs even if you want nerbs you're going to have to implement
1:08:43
nerbs and polygons and the other end is going to have to implement polygons and nerbs. So now both have to implement the
1:08:49
the system they don't like and the system they do like, right? So everybody has to do more work and it's actually
1:08:56
better to just pick one of them and then some people are going to be less happy. But even if they're less happy, they
1:09:02
only have to implement one thing. They don't have to implement two things. Even though, you know, it's better to
1:09:08
implement one bad thing than implement one bad thing and a good thing. That's more work, right? So you really want to
1:09:15
make it as small as possible. Um, so make choices. That's really important, right? Like a lot of people
1:09:23
when it comes to formats, it's like, look, my format can do a million things. And whenever I see that, that's like
1:09:28
your format's going to fail because nobody's going to implement all those things, right? Um, so um, and also
1:09:38
manage constraints like what can I require, what's the requirements of this format? If I know certain things, then
1:09:45
that helps, right? If I know that all the data coming from the the core of the
1:09:51
fighter jet is in metric, that's great. I can, you know, do that. Or even if I
1:09:56
don't like metric, maybe the core lets me choose and I know that I can be
1:10:01
guaranteed that it gives me feet if I want feet and and meters if I want meters and the core is going to handle
1:10:09
that for me. That's great. I can rely on that. it's, you know, I don't have to think about it. Um,
1:10:17
think about interactions. That's that's a very core thing. You know, if we're making a video editor, we have a
1:10:22
timeline or do we have multiple timelines? Do we have a video stream or maybe want to support multiple video
1:10:29
streams? Are are we supporting stereoscopic video or we maybe we want to have like video all around us like 50
1:10:36
displays at the same time. Can we edit that? Can we you know and and this is really important like how many
1:10:42
interactions do you have right and it goes for almost everything like can you can can this fighter jet have one radar
1:10:50
or many radars or can it have a world view or can it have multiple world
1:10:55
views? Can I you know should the pilot be able to pull up a world view from
1:11:00
another plane? Is that a useful thing? Or do they live in the same world? Like who knows, right? These are things you
1:11:07
have to decide and it's really easy to forget to to split them up and get too
1:11:12
little interaction but it's also really easy to have too many levels of interaction so it's like gets really
1:11:18
really complicated to traverse and find the thing you want right
1:11:23
um and then you want implementation freedom and I talked a little bit about that about the health care system you
1:11:28
want to basically say this is how you talk to me about health care but how I implement healthare is none of your
1:11:35
business Right? I there's many many different ways to build build a server farm that holds healthcare data and I
1:11:41
want to be able to change that and I don't want to in my API say you know oh
1:11:46
you can you know if my API has a a function that says oh you can send in
1:11:51
your own SQL query right and I allow you to do that well then all sudden now I'm
1:11:58
required to have an SQL query language and if they start sending queries for
1:12:04
certain properties. Those properties have to be in that SQL query and work.
1:12:11
And now I've locked myself into SQL on the back end. Right now I I'm screwed.
1:12:16
Right? And if I want to move to a backend that doesn't use SQL, game over,
1:12:22
right? So you really really want to make sure that that you you put locks between
1:12:27
these things. And basically it's same thing with text rendering, right? You can do it as a bit map. You can do it as
1:12:33
curves or polygons or whatever. The user just draws text. They don't have to know how it's implemented. So if you want to
1:12:40
change our implementation approach in the future, we can do that.
1:12:45
Okay. Uh another big question is plug-in systems. So do you want a plug-in system where you plug yourself in or you get
1:12:53
plugged in? Right. So um I tend to think if you can make things that can get
1:12:59
plugged in that's good because um you don't want other system to dictate how
1:13:06
your code works. And I I I said this for it's like you don't want to live in somebody else's world. You want to live
1:13:12
in your world and accept other people into your world. You don't want to go in somebody else's world and live in their
1:13:18
world. So when you make a plugin that plugin lives in your world. it lives in the world of the the thing it plugs
1:13:25
into, right? So, if you can make things that are not plugins, um, then that's a
1:13:30
good thing. If you can make them as modules that are standalone that do not require to be plugged into something,
1:13:37
that's a great thing. But a lot of times that's not possible. So, therefore, plug-in interfaces are often the right
1:13:43
right way to go. But uh if you can try to make things um that can be plugged in
1:13:49
can be reused and plugged into other things. Um that's it. Um that's my talk. So I
1:13:57
would definitely like to thank everybody for watching and um you can always find me on stream on Twitch uh or keels.com
1:14:05
or on my Twitter or all the other socials at Kelsar. Thank you for
1:14:11
watching. Bye everybody.
