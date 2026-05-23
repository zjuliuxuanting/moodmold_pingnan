# Moodmold 智能项圈 — Meshy 3D 模型生成提示词

> 目标平台：Meshy (text-to-3D / image-to-3D)
> 策略：**仅主体 + 双耳**，紧凑小物件，AI 生成成功率极高

---

## 结构说明

```
        ┌──────┐
  ┌──┐  │ OLED │  ┌──┐
  │耳│  │ 豆主体 │  │耳│
  │←→│  │      │  │←→│    ← 耳孔可穿绳
  └──┘  └──────┘  └──┘
```

- **豆（主体）**：圆角矩形电子仓，45×25×10mm，正面 OLED 窗 + LED + 传感器口
- **耳（双耳）**：左右对称的环形结构，与主体一体成型，内孔 15×4mm 可穿绳
- **无绑带**：不再生成长条带子，主体 + 双耳就是完整模型

---

## 主 Text-to-3D prompt（英文，贴 Meshy）

```
A hard surface single compact electronics pod with two symmetrical strap loops, like a smart pet tag with attachment ears. CAD precision. Injection-molded plastic aesthetic. Crisp beveled edges.

CENTER BODY: A rounded rectangular block, 45mm long, 25mm wide, 10mm thick. The top face has a crisply recessed rectangular screen panel of 22mm by 10mm, centered. Beside the screen sits a tiny circular LED port with a chamfered rim. The front narrow face has a circular sensor window with a distinct hard-edge bevel. One side face has a small rectangular charging port. All external edges have a visible 1.5mm chamfer that catches light.

LEFT EAR: Protruding from the left side of the body is a solid loop structure. The loop forms a rounded rectangular ring, outer dimensions 16mm wide by 12mm tall, with a wall cross-section of 3mm by 3mm. The inner opening is 10mm wide by 6mm tall — a clean through-hole for threading a strap. This ear is seamlessly fused into the left side of the body, as if injection-molded from the same piece of plastic.

RIGHT EAR: Protruding from the right side of the body is an identical solid loop structure. Same outer dimensions (16mm by 12mm), same wall thickness (3mm), same inner opening (10mm by 6mm). Symmetrically mirrored from the left ear. Seamlessly fused into the right side of the body.

Both ears extend outward horizontally from the body sides, aligned with the body centerline. The ears are flat in the same plane as the body — the entire object is flat and compact, like a pebble with two small handles.

Overall footprint: approximately 77mm wide (ear tip to ear tip), 25mm deep, 12mm tall at the center body.

Edge treatment: every edge is a crisp hard-surface chamfer or bevel. Panel gaps are sharp. No organic softness. No clay-like surfaces. No fillets softer than a visible bevel.

Material: smooth matte white injection-molded ABS for the body, with the screen panel in dark gray. The ears are the same white ABS as the body — one continuous material.

Single watertight manifold mesh. Exhibition display quality.
```

---

## 尺寸表

| 部件 | 参数 | 值 |
|------|------|-----|
| 豆主体 | 长 × 宽 × 厚 | 45 × 25 × 10mm |
| 豆主体 | OLED 窗 | 22 × 10mm，凹陷 |
| 左耳 | 外尺寸 | 16 × 12mm |
| 左耳 | 壁厚 | 3 × 3mm |
| 左耳 | 内孔（穿绳） | 10 × 6mm |
| 右耳 | 同左耳 | 完全镜像对称 |
| 整体 | 宽（耳尖到耳尖） | 约 77mm |
| 整体 | 最大厚度 | 约 12mm |
| 倒角 | 所有边 | 可见 1.5mm 硬边倒角 |

---

## Image-to-3D 概念图 prompt（先出图再喂 Meshy）

```
Technical product render of a compact smart pet tracker pod, hard surface CAD style,
overhead top-down view, pure white background, no shadows on floor.

The object is a single flat piece, centered in frame. Center: a crisp rounded rectangular
white block (45x25mm) with a darker recessed rectangular screen panel on top. Left side:
a solid rectangular loop ear protrudes from the body, with a clear through-hole for
threading a strap. Right side: an identical mirror ear protrudes from the body. The ears
are seamless extensions of the body — one continuous piece.

Hard surface industrial design, sharp chamfers under rim lighting, injection-molded
plastic aesthetic, crisp panel gaps, no organic softness, no clay surfaces, no shadows.
Pure product shot, 8K, vector-like edge clarity, symmetrical composition.
```

---

## 负向提示词（如有）

```
straps, bands, long strap, extending strap, woven, textile, fabric, leather,
collar band, necklace, chain, rope, thread, wire, cable,
ring, bracelet, bangle, wristband, loop only, circular body, closed ring,
organic, clay, soft edges, blobby, melted, fuzzy, blurred edges,
separate parts, assembly, hinges, screws, text, logos, fur, animal
```

---

## 为什么这个设计适合 Meshy

原始长条绑带设计有三大 AI 难题：闭环倾向、比例失控、边界模糊。

新设计把模型缩减为一个 **77×25×12mm 的紧凑小件**——主体 45mm + 两侧各一个 16mm 耳环。这正好落在 Meshy 的甜区：
- 物体小且集中 → 不会出环
- 宽高比接近 3:1 → 比例自然
- 双耳对称 → AI 擅长对称
- 不像"表带"也不像"项圈" → 语义干净
