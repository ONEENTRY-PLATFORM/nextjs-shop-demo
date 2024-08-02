/* eslint-disable @typescript-eslint/no-explicit-any */
declare type LocalizeInfo = {
  content: string;
  menuTitle: string;
  title: string;
};

declare type Page = {
  id: number;
  parentId: number;
  config: object;
  pageUrl: string;
  depth?: number;
  localizeInfos: { [key: string]: LocalizeInfo };
  isVisible?: boolean;
  isEditorDisabled?: boolean;
  products?: number;
  attributeSetId?: object;
  templateIdentifier: string;
  attributeValues?: any;
  position: number;
  type?: string;
};

declare type Menu = {
  id: number;
  identifier: string;
  localizeInfos: { [LanguageEnum]: LocalizeInfo };
  pages: Page[];
};

declare type Field = {
  [key: string]: any;
  type: string;
};

declare type AttributeValuesValue = { [key: string]: any };

declare type Product = {
  attributeSetId: number;
  attributeValues: AttributeValuesValue;
  id: number;
  isSync: number;
  isVisible: boolean;
  localizeInfos: { [key: string]: LocalizeInfo };
  position: number;
  price: number;
  relatedIds: [];
  shortDescTemplateIdentifier: string | null;
  statusId: number | null;
  templateIdentifier: string | null;
};

declare type Filter = {
  attributeMarker: string;
  conditionMarker: ConditionMarkersEnum;
  conditionValue: number | string;
  pageId?: number;
};

declare type TBadge = {
  label: string;
  value: string | number;
};

declare type Config = {
  rowsPerPage: number;
  productsPerRow: number;
};

declare type ErrorPage = {
  message: string;
  pageData: Page;
  statusCode: string;
  timestamp: string;
};

declare type DropdownItem = {
  label: string;
  value: LanguageEnum;
};

declare type Language = {
  id: number;
  shortCode: string;
  code: string;
  name: string;
  nativeName: string;
  isActive: boolean;
  image: string;
  position: {
    id: number;
    position: string;
    objectId: number;
    objectType: string;
    isLocked: boolean;
    objectCategoryId: number;
  };
  positionId: number;
};

declare type Status = {
  id: number;
  identifier: string;
  localizeInfos: { [key: string]: LocalizeInfo };
  updatedDate: string;
  version: number;
};

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
