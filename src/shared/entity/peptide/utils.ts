import { PeptideAttributes } from './models';

export const mapSearchPeptideAttributes = (properties: PeptideAttributes.Neo4jProperties): PeptideAttributes.SearchAttributes => {
  return {
    hydropathicity: properties.hydropathicity,
    charge: properties.charge.toInt(),
    isoelectricPoint: properties.isoelectric_point,
    bomanIndex: properties.boman_index,
    gaacAlphatic: properties.gaac_alphatic,
    gaacAromatic: properties.gaac_aromatic,
    gaacPositiveCharge: properties.gaac_positive_charge,
    gaacNegativeCharge: properties.gaac_negative_charge,
    gaacUncharge: properties.gaac_uncharge
  };
};

export const mapFullPeptideAttributes = (properties: PeptideAttributes.Neo4jProperties): PeptideAttributes.FullAttributes => {
  return {
    ...mapSearchPeptideAttributes(properties),
    hydrophobicity: properties.hydrophobicity,
    solvation: properties.solvation,
    amphiphilicity: properties.amphiphilicity,
    hydrophilicity: properties.hydrophilicity,
    hemolyticProbScore: properties.hemolytic_prob_score,
    stericHindrance: properties.steric_hindrance,
    netHydrogen: properties.net_hydrogen.toInt(),
    molWt: properties.mol_wt,
    aliphaticIndex: properties.aliphatic_index
  };
};
