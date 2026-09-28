import React, { useState, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useDevice } from 'vtex.device-detector'
import { useIntl } from 'react-intl'

import { defaultBenefits, bannerMessages } from './schemas/BenefitsBannerDefaultsProps'
import { bannerSchema } from './schemas/BenefitsBannerSchema'

interface StorefrontFunctionComponent<P = Record<string, unknown>> extends React.FC<P> {
  schema?: Record<string, unknown>
}

const CSS_HANDLES = [
  'container',
  'benefitsList',
  'benefitsList--row',
  'benefitsList--column',
  'benefitItem',
  'benefitItemHighlighted',
  'benefitIcon',
  'benefitTitle',
  'benefitSubtitle',
] as const

interface Benefit {
  icon: string
  title: string
  subtitle: string
  highlight: boolean
}

interface BenefitsBannerProps {
  sectionTitle: string
  layout: 'row' | 'column'
  benefits: Benefit[]
}

const BenefitsBanner: StorefrontFunctionComponent<BenefitsBannerProps> = ({
  sectionTitle,
  layout = 'row',
  benefits,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const intl = useIntl()
  const { isMobile } = useDevice()
  
  const displayTitle = sectionTitle || (intl?.formatMessage 
    ? intl.formatMessage(bannerMessages.defaultTitle) 
    : (bannerMessages?.defaultTitle?.defaultMessage || ''))

  const [activeLayout, setActiveLayout] = useState<'row' | 'column'>(layout)

  useEffect(() => {
    const isInsideSiteEditor = typeof window !== 'undefined' && window.top !== window.self

    if (isInsideSiteEditor) {
      setActiveLayout(layout)
    } else {
      setActiveLayout(isMobile ? 'column' : layout)
    }
  }, [isMobile, layout])

  const listBenefits = benefits && benefits.length > 0 ? benefits : defaultBenefits

  return (
    <div className={handles.container}>
      {displayTitle && <h2>{displayTitle}</h2>}
      <ul className={`${handles.benefitsList} ${handles[`benefitsList--${activeLayout}` as keyof typeof handles]}`}>
        {listBenefits && listBenefits.map((benefit, index) => {
          if (!benefit) return null

          const displayIcon = benefit.icon && typeof benefit.icon === 'string' && benefit.icon.trim() !== '' 
            ? benefit.icon 
            : (defaultBenefits && defaultBenefits[index]?.icon ? defaultBenefits[index].icon : '')

          return (
            <li key={index} className={`${handles.benefitItem} ${benefit.highlight ? handles.benefitItemHighlighted : ''}`}>
              {displayIcon && <img className={handles.benefitIcon} src={displayIcon} alt={benefit.title || 'Benefício'} />}
              <strong className={handles.benefitTitle}>{benefit.title || ''}</strong>
              <span className={handles.benefitSubtitle}>{benefit.subtitle || ''}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

BenefitsBanner.schema = bannerSchema

export default BenefitsBanner