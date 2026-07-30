<!-- Shared SVG filter primitives that give strokes a hand-drawn wobble via
     displacement mapping, so animated elements (the graph) don't need to
     regenerate rough.js paths on every frame. Mount once per page. -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
	<defs>
		<filter id="sketchy-wobble" x="-20%" y="-20%" width="140%" height="140%">
			<feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" result="noise" />
			<feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
		</filter>
		<filter id="sketchy-wobble-sm" x="-30%" y="-30%" width="160%" height="160%">
			<feTurbulence type="fractalNoise" baseFrequency="0.25" numOctaves="2" seed="7" result="noise" />
			<feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
		</filter>
	</defs>
</svg>
