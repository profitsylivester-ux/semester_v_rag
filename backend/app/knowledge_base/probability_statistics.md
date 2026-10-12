# GSU 07504 — Probability and Statistics

## 1. Probability axioms & rules
- $0 \le P(A) \le 1$, $P(S) = 1$, addition: $P(A\cup B) = P(A)+P(B)-P(A\cap B)$.
- Conditional: $P(A|B) = P(A\cap B)/P(B)$. Independent iff $P(A\cap B) = P(A)P(B)$.
- Total probability: $P(B) = \sum_i P(B|A_i)P(A_i)$. Bayes: $$P(A_j|B) = \frac{P(B|A_j)P(A_j)}{\sum_i P(B|A_i)P(A_i)}$$

## 2. Random variables

| Distribution | PMF/PDF | Mean | Variance |
|---|---|---|---|
| Binomial $B(n,p)$ | $\binom{n}{k}p^k(1-p)^{n-k}$ | $np$ | $np(1-p)$ |
| Poisson $Po(\lambda)$ | $e^{-\lambda}\lambda^k/k!$ | $\lambda$ | $\lambda$ |
| Geometric $(p)$ | $(1-p)^{k-1}p$ | $1/p$ | $(1-p)/p^2$ |
| Uniform $U(a,b)$ | $1/(b-a)$ | $(a+b)/2$ | $(b-a)^2/12$ |
| Exponential $(\lambda)$ | $\lambda e^{-\lambda x}$ | $1/\lambda$ | $1/\lambda^2$ |
| Normal $N(\mu,\sigma^2)$ | $\frac{1}{\sigma\sqrt{2\pi}}e^{-(x-\mu)^2/2\sigma^2}$ | $\mu$ | $\sigma^2$ |

Memoryless: exponential/geometric. CLT: $\bar{X} \approx N(\mu, \sigma^2/n)$ for large $n$.

## 3. Estimation & intervals
- Point estimators: $\bar{x}$, $s^2 = \frac{1}{n-1}\sum(x_i-\bar{x})^2$.
- 95% CI for mean (large $n$): $\bar{x} \pm 1.96\,s/\sqrt{n}$.
- Sample size for margin $E$: $n = (z_{\alpha/2}\sigma/E)^2$.

## 4. Hypothesis testing
$H_0$ vs $H_1$; statistic $z = (\bar{x}-\mu_0)/(\sigma/\sqrt{n})$; reject if $|z| > z_{\alpha/2}$ or $p < \alpha$.
Type I ($\alpha$) = false alarm; Type II ($\beta$) = missed detection; power $= 1-\beta$.

## 5. Solved problems
(a) BER $p = 10^{-3}$, $n = 1000$ bits: expected errors $\lambda = np = 1$; $P(\text{no error}) = e^{-1} \approx 0.368$ (Poisson approx).
(b) Bayes: 2% of boards faulty; test 95% sensitive, 98% specific. $P(\text{faulty}|+) = \frac{0.95\cdot0.02}{0.95\cdot0.02 + 0.02\cdot0.98} \approx 0.492$.

## 6. Regression
$y = a + bx$, $b = \mathrm{Cov}(x,y)/\mathrm{Var}(x)$; correlation $r \in [-1,1]$, $R^2$ = variance explained.
