export interface Company {
  id: number
  name: string
  industryTypeId: number
  address: string
  phone: string
  website: string
}

export interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  companyId: number
}

export interface Deal {
  id: number
  name: string
  stage: 'Lead' | 'Qualified' | 'Proposal' | 'Won' | 'Lost'
  value: number
  closeDate: Date | string
  contactId: number
  companyId: number
}

export interface Interaction {
  id: number
  interactionTypeId: number
  notes: string
  date: Date | string
  dealId?: number
  contactId: number
}

export interface InteractionType {
  id: number
  name: string
  icon: string
}

export interface IndustryType {
  id: number
  name: string
}
