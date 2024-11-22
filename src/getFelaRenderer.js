import { createRenderer } from 'fela'
import webPreset from 'fela-preset-web'
import embedded from 'fela-plugin-embedded'
import extend from 'fela-plugin-extend'
import unit from 'fela-plugin-unit'
import namedKeys from 'fela-plugin-named-keys'
import customProperty from 'fela-plugin-custom-property'
import multipleSelectors from 'fela-plugin-multiple-selectors'
import responsiveValue from 'fela-plugin-responsive-value'

export const breakpoints = {
  mobileS: 320,
  mobileM: 375,
  mobileL: 625,
  tabletS: 750,
  tablet: 1024,
  desktop: 1400,
  fullHd: 2400,
}

export const namedBreakpoints = {
  untilMobileM: `@media (max-width: ${breakpoints.mobileM}px)`,
  untilTabletS: `@media (max-width: ${breakpoints.tabletS}px)`,
  fromTabletS: `@media (min-width: ${breakpoints.tabletS}px)`,
  untilMobileL: `@media (max-width: ${breakpoints.mobileL}px)`,
  fromMobileL: `@media (min-width: ${breakpoints.mobileL}px)`,
  untilTablet: `@media (max-width: ${breakpoints.tablet}px)`,
  fromTablet: `@media (min-width: ${breakpoints.tablet}px)`,
  fromDesktop: `@media (min-width: ${breakpoints.desktop}px)`,
  fromFullHd: `@media (min-width: ${breakpoints.fullHd}px)`,
  hover: `@media (hover:hover)`,
  noHover: `@media (hover:none)`,
  portrait: `@media (orientation: portrait)`,
  landscape: `@media (orientation: landscape)`,
}

const getMediaQueries = (values, props) => {
  if (values.length === 2) {
    return [`@media (min-width: ${breakpoints.tablet}px)`]
  }
  if (values.length === 3) {
    return [
      `@media (min-width: ${breakpoints.tabletS}px)`,
      `@media (min-width: ${breakpoints.tablet}px)`,
    ]
  }
  return ['@media (min-width: 600px)', `@media (min-width: ${breakpoints.tablet}px)`]
}

const marginVertical = (value) => ({
  marginTop: value,
  marginBottom: value,
})

const marginHorizontal = (value) => ({
  marginLeft: value,
  marginRight: value,
})

const paddingVertical = (value) => ({
  paddingTop: value,
  paddingBottom: value,
})

const paddingHorizontal = (value) => ({
  paddingLeft: value,
  paddingRight: value,
})

const spaceY = (value) => ({
  "& > * + *": {
    marginTop: value,
  }
})

const spaceX = (value) => ({
  "& > * + *": {
    marginLeft: value,
  }
})

export default function getRenderer() {
  return createRenderer({
    plugins: [
      extend(),
      multipleSelectors(),
      customProperty({
        paddingVertical,
        paddingHorizontal,
        marginVertical,
        marginHorizontal,
        spaceX,
        spaceY
      }),
      embedded(),
      namedKeys(namedBreakpoints),
      responsiveValue(getMediaQueries, {
        fontSize: true,
        background: true,
        flexDirection: true
      }),
      unit('px', {
        fontSize: 'px',
        lineHeight: 'px',
      }),
      ...webPreset,
    ],
  })
}
