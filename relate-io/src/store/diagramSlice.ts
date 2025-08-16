import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DiagramState {
  rawText: string;
  // This will eventually hold the parsed JSON model
  parsedData: any | null;
  settings: {
    notation: 'chen' | 'crows-foot';
    colorMode: 'light' | 'dark';
    styleMode: 'formal' | 'sketch';
  };
}

const initialState: DiagramState = {
  rawText: `
title Sample Diagram
notation chen

user [icon: user, color: blue] {
  id string pk
  email string unique index
}

product [icon: package, color: red] {
  id string pk
  name string
}

category {
  id string pk
  name string
}

user_profile {
    user_id string fk
    first_name string
    last_name string
}

product.category_id > category.id
user_profile.user_id - user.id
`.trim(),
  parsedData: null,
  settings: {
    notation: 'chen',
    colorMode: 'light',
    styleMode: 'formal',
  },
};

const diagramSlice = createSlice({
  name: 'diagram',
  initialState,
  reducers: {
    setRawText: (state, action: PayloadAction<string>) => {
      state.rawText = action.payload;
    },
    setParsedData: (state, action: PayloadAction<any>) => {
      state.parsedData = action.payload;
    },
    setNotation: (state, action: PayloadAction<'chen' | 'crows-foot'>) => {
      state.settings.notation = action.payload;
    },
  },
});

export const { setRawText, setParsedData, setNotation } = diagramSlice.actions;

export default diagramSlice.reducer;
