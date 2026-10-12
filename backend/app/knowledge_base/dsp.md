# COU 07506 — Digital Signal Processing

## 1. Signals & Classification
- Continuous vs discrete: $x[n] = x_a(nT)$, sampling period $T$, rate $F_s = 1/T$.
- Energy: $E = \sum |x[n]|^2$. Power: $P = \lim_{N\to\infty}\frac{1}{2N+1}\sum_{n=-N}^{N}|x[n]|^2$.
- Nyquist: $F_s \ge 2F_{max}$. Aliasing folds $f$ to $|f - kF_s|$.

| Signal | Formula | Type |
|---|---|---|
| Unit impulse | $\delta[n]$ | Energy |
| Unit step | $u[n]$ | Power |
| Complex exponential | $e^{j\omega n}$ | Power |

## 2. Z-Transform
$$X(z) = \sum_{n=-\infty}^{\infty} x[n]z^{-n}$$
- Shift: $x[n-k] \leftrightarrow z^{-k}X(z)$. Convolution: $x*h \leftrightarrow X(z)H(z)$.
- Poles inside unit circle $\Rightarrow$ stable causal system.

## 3. DFT / FFT
$$X[k] = \sum_{n=0}^{N-1} x[n] e^{-j2\pi kn/N}, \quad x[n]=\frac{1}{N}\sum_{k=0}^{N-1}X[k]e^{j2\pi kn/N}$$
- FFT radix-2 cost $O(N\log_2 N)$ vs DFT $O(N^2)$.
- Zero-padding interpolates spectrum; windowing (Hamming/Hann) cuts leakage.

## 4. FIR vs IIR

| Feature | FIR | IIR |
|---|---|---|
| Feedback | None (all-zero) | Poles + zeros |
| Stability | Always stable | Must check poles |
| Linear phase | Yes (symmetric $h[n]$) | No |
| Design | Window, Parks-McClellan | Bilinear, impulse invariance |
| Cost | Higher order | Lower order, sharper cutoff |

FIR: $y[n] = \sum_{k=0}^{M} b_k x[n-k]$, $H(z)=\sum b_k z^{-k}$.

## 5. Solved problem
Design 2-point moving average: $y[n] = 0.5(x[n]+x[n-1])$.
$H(e^{j\omega}) = 0.5(1+e^{-j\omega}) = e^{-j\omega/2}\cos(\omega/2)$, magnitude $|\cos(\omega/2)|$ — null at $\omega=\pi$ (Nyquist), so it is a crude low-pass.

```matlab
b = [0.5 0.5]; a = 1;
freqz(b, a, 512, 8000); % magnitude/phase response
```

## 6. Signal chain
```mermaid
flowchart LR
    A[Analog x_a(t)] --> B[Anti-alias LPF]
    B --> C[ADC Fs]
    C --> D[Digital filter H(z)]
    D --> E[DAC + reconstruction]
```
