A PLL continuously compares the **phase** of a reference signal and a feedback signal, filters the error, and adjusts a VCO until the output frequency and phase are locked to the reference.

Input and output frequencies are locked in a relationship where output is some multiple/division of the input. PLL generates s stable frequency.

In most basic configuration, PLL compares the phase of a reference signal `F_REF` to the phase of an adjustable feedback signal `RF_IN`.

Reference signal -> phase detector -> low pass filter -> VCO -> output signal

output signal goes back into phase detector. this feedback input is where it does the multiplication by N

- Phase detector detects the difference in phase. It sees the phase error increasing, and if so, it generates error signal.
- VCO speeds up or slows down if it is told by the phase detector that there's error
- Low pass filter exists bc phase detector output is usually noisy or pulsed. It smooths the output into a smoother control voltage
### What does "lock" mean?
PLL forces reference frequency to be `output_frequency / N`
Therefore: `ouput_frequency = N * reference_frequency`

N can be a decimal less than 1 and can be a very big whole number. But usually you can only set it to certain ratios.
eg.
```
VCO = 1000 MHz

Divide by 2 -> 500 MHz
Divide by 4 -> 250 MHz
Divide by 8 -> 125 MHz
```

### Phase detector
This is needed because VCO might produce a different frequency despite receiving the same voltage as input due to several reasons:
- temperature changes
- supply voltage changes
- manufacturing variation
- aging
- noise
It compares the VCO frequency to  the reference signal. Reference signal comes from Quartz crystal which is likely gonna be reliable. Quartz has a very stable resonant frequency.
### VCO
VCO takes in a certain control voltage and outputs a frequency.

In control theory, it is modeled as 
```
G(s)=k_v / s
```
k_v = VCO gain (hz/V or rad/s/V)
s = Laplace variable
### Low pass filter
Needed for removing jitter or noise.
### Uses
Synchronization and demodulation circuits
Clock recovery
Noise and jitter reduction
frequency synthesizers
microprocessor