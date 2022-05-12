# com.axdad.copier.sdPlugin
Streamdeck copy text in input box to clipboard plugin. 

The "text" input and macro inputs weren't doing what I wanted, which is to just paste some pre-written code into another file. The IDE was doing it's IDE thing and preventing the output from being identical to the input, so I made this.
This can be used along with system hotkey control+v (or whatever it is to paste on your system)
It simply writes to the dom the text from the input box into a &lt;pre&gt;, selects it all, then calls a (now depricated but still working) document.execCommand("copy");
It's a native javascript module, so no need to compile. Toss into the plugins folder, restart the SD Software. the 5000 character limit can be modified be changing the number in propertyinspector/index.html (maxlength="5000" )

Basically the whole thing is just the template module with a few tiny lines thrown in, I'm just throwing it up here cause it's useful to me, others might find it useful too.

