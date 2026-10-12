# ETU 07521 — Electronic Design and Fabrication

## 1. Design flow
Specification → schematic → simulation (SPICE) → PCB layout → DRC/DFM → fabrication → assembly → test.

```mermaid
flowchart LR
    S[Spec] --> C[Schematic]
    C --> M[Simulate]
    M --> P[PCB layout]
    P --> F[Fab + Assembly]
    F --> T[Test + Debug]
```

## 2. PCB stackup & rules
- Standard 2-layer: Top signal / Bottom signal+GND pour. 4-layer: Signal / GND / PWR / Signal.
- Trace width for 1 oz Cu ≈ 0.5 mm per 1 A (ΔT 10 °C) as rule of thumb.
- Clearances: ≥ 0.2 mm trace/trace, ≥ 0.4 mm to board edge; keep high-speed return paths unbroken.

| Layer (4L) | Use |
|---|---|
| Top | Signals, short critical nets |
| L2 | Solid GND plane |
| L3 | Power splits |
| Bottom | Signals, test points |

## 3. Op-amp essentials
- Ideal: infinite gain, $V_+ = V_-$ (virtual short), zero input current.
- Inverting: $A_v = -R_f/R_{in}$. Non-inverting: $A_v = 1 + R_f/R_1$.
- Slew rate $SR = \max |dV_o/dt|$; GBW constant: $f_{unity} = A_v \cdot BW$.

## 4. 555 timer monostable
$T = 1.1 R C$. Astable: $f = 1.44/((R_A+2R_B)C)$, duty $D = (R_A+R_B)/(R_A+2R_B)$.

## 5. Fabrication steps
1. Gerber export (copper, mask, silk, drill, paste, profile).
2. Etching / plating, solder mask, HASL or ENIG finish.
3. SMD reflow profile: soak ~150 °C → peak 235–250 °C (Sn63/Pb37 peaks ~210 °C).
4. Inspection: AOI, X-ray for BGA, flying-probe / ICT.

## 6. Solved problem
Non-inverting amp gain 11: choose $R_1 = 10\,\mathrm{k}\Omega$, then $R_f = (A_v-1)R_1 = 100\,\mathrm{k}\Omega$. With GBW 1 MHz, bandwidth $\approx 1\,\mathrm{MHz}/11 \approx 91\,\mathrm{kHz}$.
