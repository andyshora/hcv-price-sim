import bounds from './data/bounds.json'

export const navSteps = [
  {
    name: 'black1',
    PageUp: {},
    PageDown: {
      view: 'seg/patient',
      showOverlay: false,
    },
  },
  {
    name: 'seg/patient',
    PageUp: {
      showOverlay: true,
    },
    PageDown: {
      view: 'price/patient',
      preset: 1,
    },
  },
  {
    name: 'price/patient-1',
    PageUp: {
      view: 'seg/patient',
    },
    PageDown: {
      preset: 2,
    },
  },
  {
    name: 'price/patient-2',
    PageUp: {
      preset: 1,
    },
    PageDown: {
      preset: 3,
    },
  },
  {
    name: 'price/patient-3',
    PageUp: {
      preset: 2,
    },
    PageDown: {
      preset: 4,
    },
  },
  {
    name: 'price/patient-4',
    PageUp: {
      preset: 3,
    },
    PageDown: {
      preset: 5,
    },
  },
  {
    name: 'price/patient-5',
    PageUp: {
      preset: 4,
    },
    PageDown: {
      preset: 6,
    },
  },
  {
    name: 'price/patient-6',
    PageUp: {
      preset: 5,
    },
    PageDown: {
      preset: 7,
    },
  },
  {
    name: 'price/patient-7',
    PageUp: {
      preset: 6,
    },
    PageDown: {
      preset: 8,
    },
  },
  {
    name: 'price/patient-8',
    PageUp: {
      preset: 7,
    },
    PageDown: {
      view: 'seg/time',
    },
  },
  {
    name: 'seg/time',
    PageUp: {
      view: 'price/patient',
      preset: 8,
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
      preset: 7,
    },
    PageDown: {
      view: 'summary',
    },
  },
  {
    name: 'summary',
    PageUp: {
      view: 'price/time',
      subscription: true,
      preset: 1,
    },
    PageDown: {
      showOverlay: true,
    },
  },
  {
    name: 'black2',
    PageUp: {
      view: 'summary',
      showOverlay: false,
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
    x: 25,
    y: 20,
  },
  {
    label: '',
    x: 50,
    y: 30,
  },
  {
    label: '',
    x: 70,
    y: 32,
  },
  {
    label: '',
    x: 70,
    y: 32,
  },
  {
    label: '',
    x: 70,
    y: 32,
  },
  {
    label: '',
    x: 70,
    y: 32,
  },
  {
    label: '',
    x: 100,
    y: 32,
  },
  {
    label: '',
    x: 100,
    y: 32,
  },
]

export const defaultTimePresets = [
  {
    label: '',
    x: 0,
    y: 0,
  },
  {
    label: '',
    x: 0,
    y: 10,
  },
  {
    label: '',
    x: 0,
    y: 20,
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
