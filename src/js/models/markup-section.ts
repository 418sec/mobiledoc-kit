import Markerable from './_markerable'
import { attributable } from './_attributable'
import { MARKUP_SECTION_TYPE } from './types'
import { normalizeTagName } from '../utils/dom-utils'
import { contains } from '../utils/array-utils'
import { entries } from '../utils/object-utils'
import Marker from './marker'
import Markuperable from '../utils/markuperable'
import Section from './_section'

// valid values of `tagName` for a MarkupSection
export const VALID_MARKUP_SECTION_TAGNAMES = ['aside', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].map(
  normalizeTagName
)

// valid element names for a MarkupSection. A MarkupSection with a tagName
// not in this will be rendered as a div with a className matching the
// tagName
export const MARKUP_SECTION_ELEMENT_NAMES = ['aside', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].map(
  normalizeTagName
)
export const DEFAULT_TAG_NAME = VALID_MARKUP_SECTION_TAGNAMES[8]

export default class MarkupSection extends attributable(Markerable) {
  isMarkupSection = true
  isGenerated = false

  _inferredTagName: boolean = false

  constructor(tagName = DEFAULT_TAG_NAME, markers: Markuperable[] = [], attributes = {}) {
    super(MARKUP_SECTION_TYPE, tagName, markers)
    entries(attributes).forEach(([k, v]) => this.setAttribute(k, v))
  }

  isValidTagName(normalizedTagName: string) {
    return contains(VALID_MARKUP_SECTION_TAGNAMES, normalizedTagName)
  }

  splitAtMarker(marker: Marker, offset = 0) {
    let [beforeSection, afterSection] = [
      this.builder.createMarkupSection(this.tagName, [], false, this.attributes),
      this.builder.createMarkupSection(),
    ]

    return this._redistributeMarkers(beforeSection, afterSection, marker, offset)
  }
}

export function isMarkupSection(section: Section): section is MarkupSection {
  return (section as MarkupSection).isMarkupSection
}

export function hasInferredTagName(section: Section): section is MarkupSection {
  return isMarkupSection(section) && section._inferredTagName
}
