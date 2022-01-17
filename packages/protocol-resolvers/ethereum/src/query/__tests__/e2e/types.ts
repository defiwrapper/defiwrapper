export type Protocol = {
  id: string;
  organization: string;
  name: string;
  version: string;
  forkedFrom: Protocol | null;
};

export type ResolveProtocolResponse = {
  resolveProtocol: Protocol | null;
};
