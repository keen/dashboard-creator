const getChartInput = (data: Record<string, any>) => {
  const isSavedQuery = 'query_name' in data;
  const { result } = data;

  if (isSavedQuery && typeof result === 'object' && 'steps' in result) {
    const {
      query,
      result: { steps, result: analysisResult },
    } = data;
    return {
      query,
      steps,
      result: analysisResult,
    };
  }

  return data;
};

export default getChartInput;
