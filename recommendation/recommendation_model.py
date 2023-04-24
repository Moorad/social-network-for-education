# Implementation of EASE

# This file should be called

import numpy as np

class EASE():
    """
    lamb: float, optional, default: 500
        L2-norm regularization-parameter λ ∈ R+.
    
    posB: boolean, optional, default: False
        Remove Negative Weights
    """

    def __init__(
            self,
            lamb=500,
            posB=True,
            B=None,
            U=None,
    ):
        self.lamb = lamb
        self.posB = posB
        self.B = B
        self.U = U

    def fit(self, dataset):
        # A rating matrix
        self.U = dataset.matrix
        G = self.U.T.dot(self.U).toarray()
        diag_indices = np.diag_indices(G.shape[0])
        G[diag_indices] = G.diagonal() + self.lamb
        P = np.linalg.inv(G)
        B = P / (-np.diag(P))
        B[diag_indices] = 0.0
        
        if self.posB:
            B[B<0]=0            
        
        self.B=B
      
        return self


    def recommendation(self, user_idx):
    
        if item_idx is None:
            if self.train_set.is_unk_user(user_idx):
                raise ScoreException(
                    "Can't make score prediction for (user_id=%d)" % user_idx
                )

            known_item_scores = self.U[user_idx, :].dot(self.B)
            return known_item_scores
        else:
            if self.train_set.is_unk_user(user_idx) or self.train_set.is_unk_item(
                item_idx
            ):
                raise ScoreException(
                    "Can't make score prediction for (user_id=%d, item_id=%d)"
                    % (user_idx, item_idx)
                )

            user_pred = self.B[item_idx, :].dot(self.U[user_idx, :])

            return user_pred