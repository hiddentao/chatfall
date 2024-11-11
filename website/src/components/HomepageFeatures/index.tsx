import Heading from "@theme/Heading"
import clsx from "clsx"
import React, { JSX } from "react"
import styles from "./styles.module.css"

type FeatureItem = {
  title: string
  Svg: React.ComponentType<React.ComponentProps<"svg">>
  description: JSX.Element
}

const FeatureList: FeatureItem[] = [
  {
    title: "Easily Embeddable",
    Svg: require("@site/static/img/embeddable.svg").default,
    description: (
      <>
        Quickly add comments to any webpage with minimal setup and
        configuration.
      </>
    ),
  },
  {
    title: "Real-Time Updates",
    Svg: require("@site/static/img/realtime.svg").default,
    description: <>Receive real-time in-page notifications of new comments.</>,
  },
  {
    title: "Fully Customizable",
    Svg: require("@site/static/img/layout.svg").default,
    description: (
      <>Customize styling and themes, including full support for dark mode.</>
    ),
  },
]

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
