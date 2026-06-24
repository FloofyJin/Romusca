### WTF is a polarized capacitor & non-polarized capacitor?
It's the wrong question, it's not a matter of polarized vs non-polarized.

The question should be capacitor _technology_ ie electrolytic vs tantalum vs plastic film vs ceramic - where electrolytic and tantalum _simply happen_ to be polarized.

Electrolytics have great charge density, ie lots of farads in a small volume, but their ESR and ESL suck which makes their ripple current ratings quite poor as well as making their phase angle tend significantly away from 90° down in the _audio range_. making them basically invisible at high frequencies.

Tantalums also have good charge density and better ESR/ESL than electros, however they're often made of [conflict minerals](https://en.wikipedia.org/wiki/Conflict_mineral) and they like to emit fire if their ripple current rating is exceeded, eg during poweron.

Plastic film capacitors have lovely specs all around, but their charge density is abysmal.  
Notably they don't suffer from many of the deleterious aspects of other capacitor types, which in some cases makes their abysmal charge density acceptable.

Ceramics have adequate charge density and _amazing_ ESL/ESR, but their capacitance is [profoundly affected by DC voltage bias](https://www.maximintegrated.com/en/design/technical-documents/tutorials/5/5527.html), and their piezoelectric properties can cause undesirable behaviours like audible noise and sensitivity to shock.

So, we use ceramics for local power decoupling, electros for bulk board-wide decoupling, and plastic film (where possible) in filters and analog signal pathways.

Older linear regulators can't handle ceramics' ultra low ESR and will oscillate as a result, possibly to the point of self destruction.  
Modern linear regulators usually state explicitly in their datasheet that they're stable with ceramic decoupling.
#### Types
**Polarized capacitors** (electrolytic, tantalum, some aluminum-poly types)
**Non-polarized capacitors** (ceramic, film, mica, NP0/C0G, etc.)

* Ceramic caps are good for handling fast spikes bc they have low ESR/ESL. What this means is they are good for when the voltage oscillates rly fast.

* Electrolytics can handle slow supply variation like when theres low frequency. They are good for when the voltage shoot very high over  longer time scale because they have larger storage typically.

#### ESL - Equivalent series Inductance
Leads and internal structure of the capacitor also acts like a tiny inductor in series. This is typically bad bc Capacitor should not act like inductors.

#### ESR - Equivalent series Resistance
Real capacitors arent perfect. Their leads, plates, and dialectric all have losses and can act like resistors.  This causes heating when AC current flows.

##### DC bias derating
Ceramic caps suffer from this.  