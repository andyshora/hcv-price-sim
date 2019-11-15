import bounds from './data/bounds.json'

export const navSteps = [
  {
    name: 'seg/patient',
    PageUp: {
      showOverlay: true,
    },
    PageDown: {
      view: 'price/patient',
      subscription: false,
      preset: 1,
    },
  },
  {
    name: 'price/patient-1',
    PageUp: {
      view: 'seg/patient',
      subscription: false,
    },
    PageDown: {
      preset: 2,
      subscription: false,
    },
  },
  {
    name: 'price/patient-2',
    PageUp: {
      preset: 1,
      subscription: false,
    },
    PageDown: {
      preset: 3,
      subscription: false,
    },
  },
  {
    name: 'price/patient-3',
    PageUp: {
      preset: 2,
      subscription: false,
    },
    PageDown: {
      preset: 4,
      subscription: false,
    },
  },
  {
    name: 'price/patient-4',
    PageUp: {
      preset: 3,
      subscription: false,
    },
    PageDown: {
      preset: 5,
      subscription: false,
    },
  },
  {
    name: 'price/patient-5',
    PageUp: {
      preset: 4,
      subscription: false,
    },
    PageDown: {
      preset: 6,
      subscription: false,
    },
  },
  {
    name: 'price/patient-6',
    PageUp: {
      preset: 5,
      subscription: false,
    },
    PageDown: {
      preset: 7,
      subscription: false,
    },
  },
  {
    name: 'price/patient-7',
    PageUp: {
      preset: 6,
      subscription: false,
    },
    PageDown: {
      preset: 8,
      subscription: false,
    },
  },
  {
    name: 'price/patient-8',
    PageUp: {
      preset: 7,
      subscription: false,
    },
    PageDown: {
      preset: 9,
      subscription: false,
    },
  },
  {
    name: 'price/patient-9',
    PageUp: {
      preset: 8,
      subscription: false,
    },
    PageDown: {
      preset: 0,
      subscription: false,
    },
  },
  {
    name: 'price/patient-0',
    PageUp: {
      preset: 9,
      subscription: false,
    },
    PageDown: {
      view: 'seg/time',
    },
  },
  {
    name: 'seg/time',
    PageUp: {
      view: 'price/patient',
      preset: 0,
      subscription: false,
    },
    PageDown: {
      view: 'price/time',
      subscription: true,
      preset: 1,
    },
  },
  {
    name: 'price/time:subscription-on-1',
    PageUp: {
      view: 'seg/time',
    },
    PageDown: {
      view: 'price/patient',
      showOverlay: false,
      subscription: true,
    },
  },
  {
    name: 'price/patient:subscription-on',
    PageUp: {
      view: 'price/time',
      preset: 1,
      subscription: true,
    },
    PageDown: {
      showOverlay: false,
      view: 'price/time',
      subscription: true,
      preset: 2,
    },
  },
  {
    name: 'price/time:subscription-on-2',
    PageUp: {
      view: 'price/patient',
      showOverlay: false,
      subscription: true,
      preset: 1,
    },
    PageDown: {
      preset: 3,
    },
  },
  {
    name: 'price/time:subscription-on-3',
    PageUp: {
      preset: 2,
    },
    PageDown: {
      subscription: false,
    },
  },
  {
    name: 'price/time:subscription-off',
    PageUp: {
      preset: 3,
      subscription: true,
    },
    PageDown: {
      view: 'summary',
    },
  },
  {
    name: 'summary',
    PageUp: {
      view: 'price/time',
      subscription: false,
    },
    PageDown: {},
  },
]

export const sliderBounds = {
  priceTime: {
    y: {
      min: 0,
      max: 66,
      step: 1,
      keyStep: 0.4,
    },
  },
  pricePatient: {
    x: {
      min: 0,
      max: 100,
      step: 0.5,
      keyStep: 0.8,
    },
    y: {
      min: 0.5,
      max: bounds.maxYInput / 1000,
      step: 0.5,
      keyStep: 0.5,
    },
  },
}

export const defaultPatientPresets = [
  {
    label: '',
    x: 0,
    y: 85,
  },
  {
    label: '',
    x: 0,
    y: 42.5,
  },
  {
    label: '',
    x: 0,
    y: 21.5,
  },
  {
    label: '',
    x: 0,
    y: 11,
  },
  {
    label: '',
    x: 0,
    y: 5.5,
  },
  {
    label: '',
    x: 0,
    y: 1,
  },
  {
    label: '',
    x: 0,
    y: 28.5,
  },
  {
    label: '',
    x: 9,
    y: 28.5,
  },
  {
    label: '',
    x: 0,
    y: 53.5,
  },
  {
    label: '',
    x: 100,
    y: 53.5,
  },
]

export const defaultTimePresets = [
  {
    label: '',
    x: 0,
    y: 49,
  },
  {
    label: '',
    x: 0,
    y: 39,
  },
  {
    label: '',
    x: 0,
    y: 54,
  },
]

// navSteps.map(step => {
//   console.log(step.name)
// })

export const areaColors = [
  'rgb(116, 222, 147)',
  'rgba(111, 111, 111)',
  'rgba(106, 154, 220, 1)',
  'rgba(106, 154, 220, 1)',
  '#f175ee',
]

export const breakdownColorsPrice = [
  'rgba(106, 154, 220, 1)',
  'rgba(111, 111, 111)',
  'url(#stripes-green)',
]
export const breakdownColorsPrice2 = [
  'rgba(106, 154, 220, 1)',
  'rgba(111, 111, 111)',
  'url(#stripes-green)',
  'rgba(106, 154, 220, 1)',
]
