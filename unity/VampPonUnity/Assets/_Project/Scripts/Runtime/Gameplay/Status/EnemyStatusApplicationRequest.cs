using System;

namespace VampPon.UnitySpike.Runtime.Gameplay.Status
{
    /// <summary>
    /// Typed, balance-neutral request carried by runtime hit executors.
    /// The request owns no defaults: every numeric/application policy is supplied by the caller.
    /// Optional result observation is diagnostic only and does not alter Status semantics.
    /// </summary>
    public readonly struct EnemyStatusApplicationRequest
    {
        private readonly Action<EnemyStatusApplyResult> resultObserver;

        public EnemyStatusApplicationRequest(
            EnemyStatusRuntimeKind kind,
            EnemyStatusApplicationPolicy policy)
            : this(kind, policy, null)
        {
        }

        public EnemyStatusApplicationRequest(
            EnemyStatusRuntimeKind kind,
            EnemyStatusApplicationPolicy policy,
            Action<EnemyStatusApplyResult> resultObserver)
        {
            Kind = kind;
            Policy = policy;
            this.resultObserver = resultObserver;
        }

        public EnemyStatusRuntimeKind Kind { get; }
        public EnemyStatusApplicationPolicy Policy { get; }
        public bool HasResultObserver => resultObserver != null;

        public EnemyStatusApplyResult ApplyTo(EnemyStatusRuntimeState state)
        {
            if (state == null) throw new ArgumentNullException(nameof(state));
            var result = state.Apply(Kind, Policy);
            resultObserver?.Invoke(result);
            return result;
        }
    }
}
