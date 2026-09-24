// Product data from crutches.com (Millennial Medical listings), read 2026-09-24.
// Heights and measurements are stored in INCHES, weights in POUNDS, exactly as the
// source states them. The page converts to cm / kg in app.js, never by hand.

const UNDERARM_SIZES = [
  { key: "short", label: "Short", heightIn: [56, 69], measure: "underarm", measureIn: [42, 52],
    adjust: "Underarm cradle 11 positions, hand grip 4 positions", weightLb: 2.2 },
  { key: "tall", label: "Tall", heightIn: [70, 85], measure: "underarm", measureIn: [52.5, 65.5],
    adjust: "Underarm cradle 15 positions, hand grip 5 positions", weightLb: 2.4,
    note: "At 178-180 cm, confirm your floor-to-underarm measurement is at least 133 cm. Some users at this height find the minimum setting runs slightly tall." }
];

const FOREARM_SIZES = [
  { key: "short", label: "Short", heightIn: [50, 65], measure: "hip", measureIn: [23.5, 33.5],
    adjust: "Handle 11 positions, standard and large cuffs included", weightLb: 1.8 },
  { key: "tall", label: "Tall", heightIn: [63, 80], measure: "hip", measureIn: [28.5, 42.5],
    adjust: "Handle 15 positions, standard and large cuffs included", weightLb: 1.8 }
];

const UNDERARM_POINTS = [
  "Contoured left and right grips keep your wrist in its natural position",
  "Sure Foot articulating tips pivot to stay in contact with the ground",
  "Folds in half without changing your height settings",
  "Redesigned cylinder bracket and double-reinforced strut"
];

const FOREARM_POINTS = [
  "Contoured left and right grips angled for a neutral wrist",
  "Two cuff sizes in every box: standard and large",
  "Semi-closed cuff: more support than open cuffs, still easy to slide in and out",
  "Sure Foot articulating tips for hardwood, carpet, grass and gravel"
];

const PRODUCTS = [
  {
    id: "underarm-spring", cover: "in-motion-underarm-crisscross-product-picture.webp", coverFill: true, family: "underarm", name: "in-Motion Pro Underarm",
    variant: "Spring assist", priceUsd: 149, capacityLb: 350, folds: true, warranty: "1 year, parts and replacement",
    post: "Spring assist",
    summary: "Underarm crutches engineered to take the strain off your wrists, hands and arms. A spring in the lower post absorbs each step and returns the energy forward.",
    points: ["Spring in the lower post: firm and controlled, not bouncy, quieter than traditional crutch springs", ...UNDERARM_POINTS],
    sizes: UNDERARM_SIZES,
    images: ["in-motion-underarm-crisscross-product-picture.webp", "underarm-with-model.webp", "underarm-4-elements.webp", "underarm-easy-to-adjust.webp", "tips.webp", "underarm-woman-with-dog.webp", "underarm-friends-at-concert.webp", "underarm-against-beach-wall.webp", "underarm-golfer.webp", "underarm-group-at-beach-on-bench.webp", "underarm-man-on-road.webp", "silver_tabs.webp", "crutch_placement_diagonal-07.webp"]
  },
  {
    id: "underarm-rigid", family: "underarm", name: "in-Motion Pro Underarm",
    variant: "Rigid post", priceUsd: 149, capacityLb: 350, folds: true, warranty: "1 year",
    post: "Rigid, no spring",
    summary: "The same adjustable underarm design with a solid, non-spring lower post, for users who want firm, predictable support over spring assist.",
    points: ["Solid lower post: no flex, predictable weight distribution", "Foam rubber underarm padding", ...UNDERARM_POINTS.slice(0, 3)],
    note: "Crutch pads are sold separately.",
    sizes: UNDERARM_SIZES,
    images: ["crutchesrevised.png", "01-millennial-medical-rigid-in-motion-pro-crutches-2000x2000-1.jpg", "04-millennial-medical-rigid-in-motion-pro-crutches-2000x2000-1.jpg", "07-millennial-medical-rigid-in-motion-pro-crutches-2000x2000-1.jpg", "03-millennial-medical-rigid-in-motion-pro-crutches-2000x2000-1.jpg"]
  },
  {
    id: "underarm-bundle", family: "underarm", name: "in-Motion Pro Underarm",
    variant: "Spring and rigid bundle", priceUsd: 168.99, capacityLb: 350, folds: true, warranty: "1 year",
    post: "Spring assist and rigid, both included",
    summary: "Both lower posts in one box. Switch between the spring-assist post and the rigid post as your needs change.",
    points: ["Two interchangeable lower posts", "Cushioned underarm cradle", ...UNDERARM_POINTS.slice(0, 3)],
    sizes: UNDERARM_SIZES,
    images: ["underarm-spring-plus-rigid-bundle.jpg", "02-millennial-medical-laynie-underarm-showing-folding-capability-no-pads-2000x2000-1.webp", "6500c-tall-underarm-pic.webp", "05-millennial-medical-rigid-in-motion-pro-crutches-2000x2000-1.jpg", "undearm-casual-at-the-track.jpg", "boots-and-crutches-up-close-scaled.jpg", "6000c-carnival-ride-small-scaled.jpg"]
  },
  {
    id: "forearm-spring", cover: "in-motion-crutches_featured-16x9_1600x900.webp", coverFill: true, family: "forearm", name: "in-Motion Pro Forearm",
    variant: "Spring assist", priceUsd: 149, capacityLb: 350, folds: true, warranty: "1 year, parts and replacement",
    post: "Spring assist",
    summary: "Forearm crutches for all-day use through longer recoveries. The patented lower-post spring absorbs each step to reduce shoulder, elbow and wrist fatigue.",
    points: ["Patented spring: firm, controlled energy return, quieter than traditional spring crutches", ...FOREARM_POINTS],
    sizes: FOREARM_SIZES,
    images: ["in-motion-crutches_featured-16x9_1600x900.webp", "forearm-4-product-highlights.webp", "product-elements_gallery-4x3_1200x900.webp", "forearm-at-the-track-scaled.webp", "forearm-hiking-in-utah-with-dog.webp", "forearm-woman-at-pool.webp", "forearm-office-setting.webp", "forearm-crutches-woman-hiking-zion.webp", "forearm-jungle-hiking.webp", "forearm-secure-grip.webp", "forearm-easy-to-adjust.webp", "forearm-climbing.webp", "7500c-tall-forearm-scaled.webp", "forearm-crutch-top-half-1.webp", "cuffs-and-cuff-clips-1.webp", "cuff_and_post.webp"]
  },
  {
    id: "forearm-rigid", family: "forearm", name: "in-Motion Pro Forearm",
    variant: "Rigid post", priceUsd: 149, capacityLb: 350, folds: true, warranty: "1 year",
    post: "Rigid, no spring",
    summary: "The ergonomics of the in-Motion line with a solid, non-spring lower post for maximum stability and control. Quiet, with no extra movement.",
    points: ["Solid lower post: less flex, consistent weight distribution", ...FOREARM_POINTS.slice(0, 2), FOREARM_POINTS[3]],
    sizes: FOREARM_SIZES,
    images: ["untitled-1-08-08-2025-11-02-06.webp", "01-millennial-medical-rigid-in-motion-forearm-crutches-2000x2000-1.webp", "04-millennial-medical-rigid-in-motion-forearm-crutches-2000x2000-1.webp", "forearm-crutches-rehab-facility-e1771966267260.webp", "03-millennial-medical-rigid-in-motion-forearm-crutches-2000x2000-1.jpg", "08-millennial-medical-rigid-in-motion-forearm-crutches-2000x2000-1.jpg", "forearm-crutches-home-setting.webp", "05-millennial-medical-rigid-in-motion-forearm-crutches-2000x2000-1.jpg", "07-millennial-medical-rigid-in-motion-forearm-crutches-2000x2000-1.jpg"]
  },
  {
    id: "forearm-bundle", family: "forearm", name: "in-Motion Pro Forearm",
    variant: "Spring and rigid bundle", priceUsd: 168.99, capacityLb: 350, folds: true, warranty: "1 year limited, tips 60 days",
    post: "Spring assist and rigid, both included",
    summary: "Both lower posts in one box, to match your activity level and recovery stage. Aircraft-grade aluminum, tool-free adjustment.",
    points: ["Two interchangeable lower posts", "Tool-free handle and cuff height adjustment", "Fully molded V-shaped forearm cuffs, standard and large", "Collapses for transport and storage"],
    sizes: FOREARM_SIZES,
    images: ["forearm-spring-plus-rigid-bundle.webp", "01-millennial-medical-laynie-forearm-with-one-model-2000x2000-1.webp", "09-millennial-medical-rigid-in-motion-forearm-crutches-2000x2000-1.jpg", "forearm-crutches-in-office-setting.png", "7500c-tall-forearm-pic-1.jpg", "by-the-wheelchair.jpg", "hiking-in-the-forest-smaller.jpg"]
  },
  {
    id: "youth", family: "youth", name: "in-Motion Youth",
    variant: "Rigid post", priceUsd: 129, capacityLb: 300, folds: false, warranty: null,
    post: "Rigid, no spring",
    summary: "Built for the 150-170 cm range from the start, instead of an adult crutch run down to the last hole. For teen athletes, students and shorter adults.",
    points: ["Left and right contoured handles, sloped for a neutral wrist", "Handle adjusts across the top five holes, offset so it does not wobble", "Articulating tips for gym floors, tile, hardwood, grass and gravel", "The whole set ships at 2.7 kg, packaging included"],
    note: "Does not fold. Above 170 cm, choose an in-Motion Pro model.",
    sizes: [{ key: "one", label: "One size", heightIn: [59, 67], measure: "underarm", measureIn: [45, 51],
      adjust: "Handle: top five holes on the post", weightLb: null }],
    images: ["freedom-criss-cross-1.webp", "freedom-crutches-on-stairs.webp", "freedom-side-by-side.webp", "freedom-handle-side.webp", "freedom-unassembled.webp", "freedom-crutches-by-beach-scaled.webp"]
  },
  {
    id: "a-frame", family: "standard", name: "Standard A-Frame",
    variant: "Aluminum", priceUsd: 34.99, capacityLb: 350, folds: null, warranty: "30 days",
    post: "Classic A-frame",
    summary: "The classic A-frame shape in lightweight aluminum. A practical choice for short-term recovery, or a backup pair to keep at home.",
    points: ["Double-extruded center tube for strength", "Tool-free push-button height adjustment in 2.5 cm steps", "Extra-thick, latex-free underarm pads and hand grips", "Non-skid jumbo contoured tips"],
    sizes: [{ key: "tall-adult", label: "Tall adult", heightIn: [70, 78], measure: null, measureIn: null,
      adjust: "Push-button, 2.5 cm steps; hand grip tool-free", weightLb: 3.15 }],
    images: ["a-frame-crutches-square.png", "a-frames-at-the-park.webp", "a-frames-at-home.webp", "a-frames-at-a-party.webp"]
  },
  {
    id: "refurb-underarm", cover: "in-motion-underarm-crisscross-product-picture.webp", coverFill: true, family: "refurbished", name: "in-Motion Pro Underarm",
    variant: "Refurbished", priceUsd: 109, capacityLb: 350, folds: true, warranty: "1 year, parts and replacement",
    post: "Spring assist",
    summary: "Returned pairs of the spring-assist underarm crutch. Fully functional; may have minor cosmetic scratches, usually on the inside.",
    points: ["Same crutch as the new spring-assist model", "Latex-free, Class 1 medical device", ...UNDERARM_POINTS.slice(0, 3)],
    sizes: UNDERARM_SIZES,
    images: ["underarm-tall-and-short-against-mural.png", "short-underarm-dissambled.jpg", "underarm-after-acl-surgery-e1774704857521.webp", "underarm-on-bench.webp"]
  },
  {
    id: "refurb-forearm", family: "refurbished", name: "in-Motion Pro Forearm",
    variant: "Refurbished", priceUsd: 109, capacityLb: 350, folds: true, warranty: "1 year, parts and replacement",
    post: "Spring assist",
    summary: "Pairs that were opened, assembled and returned with little use. Each pair is inspected and repacked, and arrives new or very close to new.",
    points: ["Same crutch as the new spring-assist model", ...FOREARM_POINTS.slice(0, 2)],
    sizes: FOREARM_SIZES,
    images: ["forearm-product-elements.webp", "forearm-tall-disassembled-1.jpg", "forearm-crutches-flowers-scaled.webp"]
  }
];

const FAMILIES = [
  { key: "all", label: "All" },
  { key: "underarm", label: "Underarm" },
  { key: "forearm", label: "Forearm" },
  { key: "youth", label: "Youth" },
  { key: "standard", label: "Standard" },
  { key: "refurbished", label: "Refurbished" }
];
