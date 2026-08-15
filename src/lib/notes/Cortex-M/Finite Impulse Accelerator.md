A Low pass filter allows low frequency pass through while attenuating high frequency. The reason where the frequency cuts off is called cut off frequency. The frequency that passes is called "pass band" while frequency where it gradually drops off is called "stop band".

Frequency cuts off gradually. 1 octave from cut off frequency is called 1st order filter.

In below example, cut off frequency is -3dB, 1st order filter will be at -6dB / octave.
Order of the filter determines the steepness of the curve. If there is 2nd order filter, it would be another red line in the graph with a steeper line.
![[res/Pasted image 20260624192047.png]]

Below, we see that attenuation is around -3dB when frequency is 500Hz. And attenuation is around -12dB when cut off frequency is 1000Hz.
1000Hz is exactly one octave above 500Hz, so it is 2nd order low pass filter and roll off slope -12dB/octave

![[res/Pasted image 20260624194112.png]]

### Nyquist frequency
Nyquist frequency = Half the sample rate
You cannot represent freq higher  than the Nyquist freq for a given sampling rate.

Half Nyquist frequency is when you have 2 samples in a cycle.
### Impulse signal
Single sample value. When you pass an impulse signal through a digital signal, you get impulse response. This is useful bc knowing impulse response allows you to understand how a filter or an algorithm reacts to any arbitrary input.
### Notation
input signal = x(n)
output signal = y(n)
n is the current position of the sample.
### N-sample delay
use a buffer to  store n-th sample then output the item in the buffer in the next cycle. This buffer is the size of how much you want to delay the response.
### Feed forward loop
Feed forward loop will often smear the input by n-th delay amount. 

The delay will also phase shift the input by delay amount. In a Nyquist signal, 1-sample delay creates 180 degree phase shift
![[res/Pasted image 20260624221220.png]]

Finite Impulse accelerator will feed the input into this forward loop to attenuate extreme noises.