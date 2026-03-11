export type UserHair = {
  color: string;
  type: string;
};

export type UserCoordinates = {
  lat: number;
  lng: number;
};

export type UserAddress = {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: UserCoordinates;
  country: string;
};

export type UserBank = {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
};

export type UserCompany = {
  department: string;
  name: string;
  title: string;
  address: UserAddress;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: UserHair;
  address: UserAddress;
  university: string;
  company: UserCompany;
  bank: UserBank;
  role: string;
};
