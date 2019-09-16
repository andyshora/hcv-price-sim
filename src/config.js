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
      view: 'seg/time',
    },
  },
  {
    name: 'seg/time',
    PageUp: {
      view: 'price/patient',
      preset: 7,
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
      subscription: false,
    },
  },
  {
    name: 'price/time:subscription-off',
    PageUp: {
      preset: 1,
      subscription: true,
    },
    PageDown: {
      preset: 2,
      subscription: true,
    },
  },
  {
    name: 'price/time:subscription-on-2',
    PageUp: {
      subscription: false,
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
      showOverlay: true,
    },
  },
  {
    name: 'black2',
    PageUp: {
      view: 'price/time',
      showOverlay: false,
      subscription: true,
      preset: 3,
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
  '#6c9bdc',
  '#6c9bdc',
  '#f175ee',
]

export const breakdownColorsPrice = [
  '#6c9bdc',
  'rgba(111, 111, 111)',
  'rgb(116, 222, 147)',
]
export const breakdownColorsPrice2 = [
  '#6c9bdc',
  '#6c9bdc',
  'rgba(111, 111, 111)',
  '#f175ee',
]
