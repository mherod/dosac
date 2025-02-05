import {
  formatEpisodeId,
  formatTimestamp,
  formatVttTimestamp,
  parseEpisodeId,
  parseFrameId,
} from "../format-utils";

describe("formatEpisodeId", () => {
  it("formats valid episode IDs correctly", () => {
    expect(formatEpisodeId("s01e02")).toBe("S1 E2");
    expect(formatEpisodeId("s12e05")).toBe("S12 E5");
    expect(formatEpisodeId("S01E02")).toBe("S1 E2");
  });

  it("handles null and undefined inputs", () => {
    expect(formatEpisodeId(null)).toBe("");
    expect(formatEpisodeId(undefined)).toBe("");
  });

  it("returns original string for invalid formats", () => {
    expect(formatEpisodeId("invalid")).toBe("invalid");
    expect(formatEpisodeId("s1e2")).toBe("s1e2");
    expect(formatEpisodeId("s001e002")).toBe("s001e002");
  });
});

describe("formatTimestamp", () => {
  it("formats valid timestamps correctly", () => {
    expect(formatTimestamp("00-03.120")).toBe("0:03");
    expect(formatTimestamp("01-30.000")).toBe("1:30");
    expect(formatTimestamp("59-59.999")).toBe("59:59");
  });

  it("returns original string for invalid formats", () => {
    expect(formatTimestamp("invalid")).toBe("invalid");
    expect(formatTimestamp("00:03.120")).toBe("00:03.120");
    expect(formatTimestamp("1-30.000")).toBe("1-30.000");
  });
});

describe("formatVttTimestamp", () => {
  it("formats valid VTT timestamps correctly", () => {
    expect(formatVttTimestamp("00:03.120 --> 00:04.960")).toBe("00-03.120");
    expect(formatVttTimestamp("01:30.000 --> 01:35.000")).toBe("01-30.000");
  });

  it("throws error for invalid formats", () => {
    expect(() => formatVttTimestamp("invalid")).toThrow(
      "Invalid timestamp format",
    );
    expect(() => formatVttTimestamp("")).toThrow("Invalid timestamp format");
    expect(() => formatVttTimestamp("00:03.120")).toThrow(
      "Invalid timestamp format",
    );
  });
});

describe("parseEpisodeId", () => {
  it("parses valid episode IDs correctly", () => {
    expect(parseEpisodeId("s01e02")).toEqual({ season: 1, episode: 2 });
    expect(parseEpisodeId("s12e05")).toEqual({ season: 12, episode: 5 });
  });

  it("throws error for null or undefined inputs", () => {
    expect(() => parseEpisodeId(null)).toThrow(
      "Episode ID cannot be null or undefined",
    );
    expect(() => parseEpisodeId(undefined)).toThrow(
      "Episode ID cannot be null or undefined",
    );
  });

  it("throws error for invalid formats", () => {
    expect(() => parseEpisodeId("invalid")).toThrow(
      "Invalid episode ID format",
    );
    expect(() => parseEpisodeId("s1e2")).toThrow("Invalid episode ID format");
    expect(() => parseEpisodeId("s001e002")).toThrow(
      "Invalid episode ID format",
    );
  });
});

describe("parseFrameId", () => {
  it("parses valid frame IDs correctly", () => {
    expect(parseFrameId("s01e02-03-45.678")).toEqual({
      season: "s01e02",
      episode: "s01e02",
      timestamp: "03-45.678",
    });
  });

  it("throws error for invalid formats", () => {
    expect(() => parseFrameId("invalid")).toThrow("Invalid URL format");
    expect(() => parseFrameId("s01e02-invalid")).toThrow(
      "Invalid timestamp format",
    );
    expect(() => parseFrameId("invalid-03-45.678")).toThrow(
      "Invalid season format",
    );
  });

  it("throws error for malformed timestamps", () => {
    expect(() => parseFrameId("s01e02-3-45.678")).toThrow(
      "Invalid timestamp format",
    );
    expect(() => parseFrameId("s01e02-03-5.678")).toThrow(
      "Invalid timestamp format",
    );
    expect(() => parseFrameId("s01e02-03-45.67")).toThrow(
      "Invalid timestamp format",
    );
  });
});
