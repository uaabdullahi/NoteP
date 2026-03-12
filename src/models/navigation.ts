import { Note } from './Note';

export type RootStackParamList = {
    Home: undefined;
    Editor: { note?: Note };
};
